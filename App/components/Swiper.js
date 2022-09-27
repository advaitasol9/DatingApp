import React, {Component} from 'react';
import {
  PanResponder,
  Text,
  View,
  Dimensions,
  Animated,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import {verticalScale, scale} from '../configs/size';

const {height, width} = Dimensions.get('window');

const SWIPE_MULTIPLY_FACTOR = 4.5;

const calculateCardIndexes = (firstCardIndex, cards) => {
  firstCardIndex = firstCardIndex || 0;
  const previousCardIndex =
    firstCardIndex === 0 ? cards.length - 1 : firstCardIndex - 1;
  const secondCardIndex =
    firstCardIndex === cards.length - 1 ? 0 : firstCardIndex + 1;
  return {firstCardIndex, secondCardIndex, previousCardIndex};
};

const rebuildStackAnimatedValues = props => {
  const stackPositionsAndScales = {};
  const {stackSize, stackSeparation, stackScale} = props;

  for (let position = 0; position < stackSize; position++) {
    stackPositionsAndScales[`stackPosition${position}`] = new Animated.Value(
      stackSeparation * position,
    );
    stackPositionsAndScales[`stackScale${position}`] = new Animated.Value(
      (100 - stackScale * position) * 0.01,
    );
  }

  return stackPositionsAndScales;
};

class Swiper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...calculateCardIndexes(props.cardIndex, props.cards),
      pan: new Animated.ValueXY(),
      cards: props.cards,
      previousCardX: new Animated.Value(props.previousCardDefaultPositionX),
      previousCardY: new Animated.Value(props.previousCardDefaultPositionY),
      swipedAllCards: false,
      panResponderLocked: false,
      slideGesture: false,
      swipeBackXYPositions: [],
      isSwipingBack: false,
      topSwipe: false,
      downSwipe: false,
      ...rebuildStackAnimatedValues(props),
      isPanResponderOn: true,
    };

    this._mounted = true;
    this._animatedValueX = 0;
    this._animatedValueY = 0;
    this.yOffset = new Animated.Value(0);
    this.xOffset = new Animated.Value(0);
    this.cardWidth = Animated.subtract(scale(316), this.yOffset);
    this.cardHeight = Animated.subtract(verticalScale(471), this.xOffset);

    this.state.pan.x.addListener(value => (this._animatedValueX = value.value));
    this.state.pan.y.addListener(value => (this._animatedValueY = value.value));

    this.initializeCardStyle();
    this.initializePanResponder();
  }

  disablePanResponder = () => {
    this.setState({isPanResponderOn: false});
  };

  enablePanResponder = () => {
    this.setState({isPanResponderOn: true});
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    const {props, state} = this;
    const propsChanged =
      !isEqual(props.cards, nextProps.cards) ||
      props.cardIndex !== nextProps.cardIndex;
    const stateChanged =
      nextState.firstCardIndex !== state.firstCardIndex ||
      nextState.secondCardIndex !== state.secondCardIndex ||
      nextState.previousCardIndex !== state.previousCardIndex ||
      nextState.swipedAllCards !== state.swipedAllCards ||
      nextState.topSwipe !== state.topSwipe ||
      nextState.downSwipe !== state.downSwipe;
    return propsChanged || stateChanged;
  };

  componentWillUnmount = () => {
    this._mounted = false;
    this.state.pan.x.removeAllListeners();
    this.state.pan.y.removeAllListeners();
    Dimensions.removeEventListener('change', this.onDimensionsChange);
  };

  getCardStyle = () => {
    const cardWidth = scale(316);
    const cardHeight = verticalScale(455);

    return {
      width: cardWidth,
      height: cardHeight,
      top: verticalScale(63),
      alignSelf: 'center',
    };
  };

  initializeCardStyle = () => {
    // this.forceUpdate()
    Dimensions.addEventListener('change', this.onDimensionsChange);
  };

  initializePanResponder = () => {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (event, gestureState) => false,

      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const isVerticalSwipe = Math.sqrt(
          Math.pow(gestureState.dx, 2) < Math.pow(gestureState.dy, 2),
        );
        if (!this.props.verticalSwipe && isVerticalSwipe) {
          return false;
        }
        return (
          Math.sqrt(
            Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2),
          ) > 10
        );
      },
      onPanResponderGrant: this.onPanResponderGrant,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderRelease,
      onPanResponderTerminate: this.onPanResponderRelease,
    });
  };

  createAnimatedEvent = () => {
    const {horizontalSwipe, verticalSwipe} = this.props;
    const {x, y} = this.state.pan;
    const dx = horizontalSwipe ? x : new Animated.Value(0);
    const dy = verticalSwipe ? y : new Animated.Value(0);
    return {dx, dy};
  };

  onDimensionsChange = () => {
    this.forceUpdate();
  };

  onPanResponderMove = (event, gestureState) => {
    if (!this.state.isPanResponderOn) return;
    this.props.onSwiping(this._animatedValueX, this._animatedValueY);

    let isSwipingTop, isSwipingBottom;
    this.yOffset.setValue(Math.abs(gestureState.dy) * 0.2);
    this.xOffset.setValue(Math.abs(gestureState.dy) * 0.3);

    if (!this.state.topSwipe && gestureState.dy < 0)
      this.setState({topSwipe: true, downSwipe: false});

    if (!this.state.downSwipe && gestureState.dy > 0)
      this.setState({downSwipe: true, topSwipe: false});

    if (
      Math.abs(this._animatedValueY) > Math.abs(this._animatedValueX) &&
      Math.abs(this._animatedValueY) > this.props.verticalThreshold
    ) {
      if (this._animatedValueY > 0) isSwipingBottom = true;
      else isSwipingTop = true;
    }

    const {onTapCardDeadZone} = this.props;
    if (
      this._animatedValueY < -onTapCardDeadZone ||
      this._animatedValueY > onTapCardDeadZone
    ) {
      this.setState({
        slideGesture: true,
      });
    }

    return Animated.event([null, this.createAnimatedEvent()])(
      event,
      gestureState,
    );
  };

  onPanResponderGrant = (event, gestureState) => {
    if (!this.state.isPanResponderOn) return;
    this.props.dragStart && this.props.dragStart();
    if (!this.state.panResponderLocked) {
      this.state.pan.setOffset({
        x: this._animatedValueX,
        y: this._animatedValueY,
      });
    }

    this.state.pan.setValue({
      x: 0,
      y: 0,
    });
  };

  validPanResponderRelease = () => {
    const {
      disableBottomSwipe,
      disableLeftSwipe,
      disableRightSwipe,
      disableTopSwipe,
    } = this.props;

    const {isSwipingLeft, isSwipingRight, isSwipingTop, isSwipingBottom} =
      this.getSwipeDirection(this._animatedValueX, this._animatedValueY);

    return (
      (isSwipingLeft && !disableLeftSwipe) ||
      (isSwipingRight && !disableRightSwipe) ||
      (isSwipingTop && !disableTopSwipe) ||
      (isSwipingBottom && !disableBottomSwipe)
    );
  };

  onPanResponderRelease = (e, gestureState) => {
    this.props.dragEnd && this.props.dragEnd();
    if (this.state.panResponderLocked) {
      this.state.pan.setValue({
        x: 0,
        y: 0,
      });
      this.state.pan.setOffset({
        x: 0,
        y: 0,
      });

      return;
    }

    const {horizontalThreshold, verticalThreshold} = this.props;

    const animatedValueX = Math.abs(this._animatedValueX);
    const animatedValueY = Math.abs(this._animatedValueY);

    const isSwiping =
      animatedValueX > horizontalThreshold ||
      animatedValueY > verticalThreshold;

    //console.log('isSwiping', isSwiping);
    //console.log('validRlease', this.validPanResponderRelease());

    if (isSwiping && this.validPanResponderRelease()) {
      const onSwipeDirectionCallback = this.getOnSwipeDirectionCallback(
        this._animatedValueX,
        this._animatedValueY,
      );

      this.swipeCard(onSwipeDirectionCallback);
      setTimeout(() => {
        this.yOffset.setValue(0);
        this.xOffset.setValue(0);
      }, this.props.swipeAnimationDuration);
      setTimeout(() => {
        this.setState({topSwipe: false, downSwipe: false});
      }, this.props.swipeAnimationDuration * 0.75);
    } else {
      this.resetTopCard();
    }

    if (!this.state.slideGesture) {
      this.props.onTapCard(this.state.firstCardIndex);
    }

    this.setState({
      slideGesture: false,
    });
  };

  getOnSwipeDirectionCallback = (animatedValueX, animatedValueY) => {
    const {onSwipedLeft, onSwipedRight, onSwipedTop, onSwipedBottom} =
      this.props;

    const {isSwipingLeft, isSwipingRight, isSwipingTop, isSwipingBottom} =
      this.getSwipeDirection(animatedValueX, animatedValueY);

    if (isSwipingRight) {
      return onSwipedRight;
    }

    if (isSwipingLeft) {
      return onSwipedLeft;
    }

    if (isSwipingTop) {
      return onSwipedTop;
    }

    if (isSwipingBottom) {
      return onSwipedBottom;
    }
  };

  mustDecrementCardIndex = (animatedValueX, animatedValueY) => {
    const {isSwipingLeft, isSwipingRight, isSwipingTop, isSwipingBottom} =
      this.getSwipeDirection(animatedValueX, animatedValueY);

    return (
      (isSwipingLeft && this.props.goBackToPreviousCardOnSwipeLeft) ||
      (isSwipingRight && this.props.goBackToPreviousCardOnSwipeRight) ||
      (isSwipingTop && this.props.goBackToPreviousCardOnSwipeTop) ||
      (isSwipingBottom && this.props.goBackToPreviousCardOnSwipeBottom)
    );
  };

  getSwipeDirection = (animatedValueX, animatedValueY) => {
    const isSwipingLeft = animatedValueX < -this.props.horizontalThreshold;
    const isSwipingRight = animatedValueX > this.props.horizontalThreshold;
    const isSwipingTop = animatedValueY < -this.props.verticalThreshold;
    const isSwipingBottom = animatedValueY > this.props.verticalThreshold;

    return {isSwipingLeft, isSwipingRight, isSwipingTop, isSwipingBottom};
  };

  resetTopCard = cb => {
    Animated.spring(this.state.pan, {
      toValue: 0,
      friction: this.props.topCardResetAnimationFriction,
      tension: this.props.topCardResetAnimationTension,
    }).start(cb);

    this.state.pan.setOffset({
      x: 0,
      y: 0,
    });

    this.yOffset.setValue(0);
    this.xOffset.setValue(0);
    this.setState({topSwipe: false, downSwipe: false});

    this.props.onSwipedAborted();
  };

  swipeTop = (mustDecrementCardIndex = false) => {
    this.swipeCard(
      this.props.onSwipedTop,
      0,
      -this.props.verticalThreshold,
      mustDecrementCardIndex,
    );
  };

  swipeBottom = (mustDecrementCardIndex = false) => {
    this.swipeCard(
      this.props.onSwipedBottom,
      0,
      this.props.verticalThreshold,
      mustDecrementCardIndex,
    );
  };

  swipeCard = (
    onSwiped,
    x = this._animatedValueX,
    y = this._animatedValueY,
    mustDecrementCardIndex = false,
  ) => {
    this.setState({panResponderLocked: true});
    this.animateStack();
    Animated.timing(this.state.pan, {
      toValue: {
        x: x * SWIPE_MULTIPLY_FACTOR,
        y: y * SWIPE_MULTIPLY_FACTOR,
      },
      duration: this.props.swipeAnimationDuration,
    }).start(() => {
      this.setSwipeBackCardXY(x, y, () => {
        mustDecrementCardIndex = mustDecrementCardIndex
          ? true
          : this.mustDecrementCardIndex(
              this._animatedValueX,
              this._animatedValueY,
            );

        if (mustDecrementCardIndex) {
          this.decrementCardIndex(onSwiped);
        } else {
          this.incrementCardIndex(onSwiped);
        }
      });
    });
  };

  setSwipeBackCardXY = (x = -width, y = 0, cb) => {
    this.setState(
      {swipeBackXYPositions: [...this.state.swipeBackXYPositions, {x, y}]},
      cb,
    );
  };

  //   animatePreviousCard = ({x, y}, cb) => {
  //     const {previousCardX, previousCardY} = this.state;
  //     previousCardX.setValue(x * SWIPE_MULTIPLY_FACTOR);
  //     previousCardY.setValue(y * SWIPE_MULTIPLY_FACTOR);
  //     Animated.parallel([
  //       Animated.spring(this.state.previousCardX, {
  //         toValue: 0,
  //         friction: this.props.stackAnimationFriction,
  //         tension: this.props.stackAnimationTension,
  //         useNativeDriver: true,
  //       }),
  //       Animated.spring(this.state.previousCardY, {
  //         toValue: 0,
  //         friction: this.props.stackAnimationFriction,
  //         tension: this.props.stackAnimationTension,
  //         useNativeDriver: true,
  //       }),
  //     ]).start(() => {
  //       this.setState({isSwipingBack: false});
  //       this.decrementCardIndex(cb);
  //     });
  //   };

  animateStack = () => {
    const {cards, secondCardIndex, swipedAllCards} = this.state;
    let {stackSize, infinite, showSecondCard} = this.props;
    let index = secondCardIndex;

    while (stackSize-- > 1 && showSecondCard && !swipedAllCards) {
      if (
        this.state[`stackPosition${stackSize}`] &&
        this.state[`stackScale${stackSize}`]
      ) {
        const newSeparation = this.props.stackSeparation * (stackSize - 1);
        const newScale = (100 - this.props.stackScale * (stackSize - 1)) * 0.01;
        Animated.parallel([
          Animated.spring(this.state[`stackPosition${stackSize}`], {
            toValue: newSeparation,
            friction: this.props.stackAnimationFriction,
            tension: this.props.stackAnimationTension,
            useNativeDriver: true,
          }),
          Animated.spring(this.state[`stackScale${stackSize}`], {
            toValue: newScale,
            friction: this.props.stackAnimationFriction,
            tension: this.props.stackAnimationTension,
            useNativeDriver: true,
          }),
        ]).start();
      }

      if (index === cards.length - 1) {
        if (!infinite) break;
        index = 0;
      } else {
        index++;
      }
    }
  };

  incrementCardIndex = onSwiped => {
    const {firstCardIndex} = this.state;
    const {infinite} = this.props;
    let newCardIndex = firstCardIndex + 1;
    let swipedAllCards = false;

    this.onSwipedCallbacks(onSwiped);

    const allSwipedCheck = () => newCardIndex === this.state.cards.length;

    if (allSwipedCheck()) {
      if (!infinite) {
        this.props.onSwipedAll();
        // onSwipeAll may have added cards
        if (allSwipedCheck()) {
          swipedAllCards = true;
        }
      } else {
        newCardIndex = 0;
      }
    }

    this.setCardIndex(newCardIndex, swipedAllCards);
  };

  decrementCardIndex = cb => {
    const {firstCardIndex} = this.state;
    const lastCardIndex = this.state.cards.length - 1;
    const previousCardIndex = firstCardIndex - 1;

    const newCardIndex =
      firstCardIndex === 0 ? lastCardIndex : previousCardIndex;

    this.onSwipedCallbacks(cb);
    this.setCardIndex(newCardIndex, false);
  };

  //   jumpToCardIndex = newCardIndex => {
  //     if (this.state.cards[newCardIndex]) {
  //       this.setCardIndex(newCardIndex, false);
  //     }
  //   };

  onSwipedCallbacks = swipeDirectionCallback => {
    const previousCardIndex = this.state.firstCardIndex;
    this.props.onSwiped(previousCardIndex, this.state.cards[previousCardIndex]);

    if (swipeDirectionCallback) {
      swipeDirectionCallback(
        previousCardIndex,
        this.state.cards[previousCardIndex],
      );
    }
  };

  setCardIndex = (newCardIndex, swipedAllCards) => {
    if (this._mounted) {
      this.setState(
        {
          ...calculateCardIndexes(newCardIndex, this.state.cards),
          swipedAllCards: swipedAllCards,
          panResponderLocked: false,
        },
        this.resetPanAndScale,
      );
    }
  };

  resetPanAndScale = () => {
    const {previousCardDefaultPositionX, previousCardDefaultPositionY} =
      this.props;
    this.state.pan.setValue({x: 0, y: 0});
    this.state.previousCardX.setValue(previousCardDefaultPositionX);
    this.state.previousCardY.setValue(previousCardDefaultPositionY);
  };

  //   calculateNextPreviousCardPosition = () => {
  //     const {swipeBackXYPositions} = this.state;
  //     let {previousCardDefaultPositionX: x, previousCardDefaultPositionY: y} =
  //       this.props;
  //     const swipeBackPosition = swipeBackXYPositions.splice(-1, 1);
  //     if (swipeBackPosition[0]) {
  //       x = swipeBackPosition[0].x;
  //       y = swipeBackPosition[0].y;
  //     }
  //     return {x, y};
  //   };

  calculateSwipableCardStyle = () => {
    const width =
      this.state.pan.y > 0
        ? Animated.multiply(-1, this.state.pan.y)
        : this.state.pan.y;

    const wid2 = Animated.divide(width, 10);

    //console.log('cardWidht', width);

    return [
      styles.card,
      this.getCardStyle(),
      {
        zIndex: 1,
        top: Animated.add(verticalScale(63), this.state.pan.y),
        // transform: [
        //   {translateX: this.state.pan.x},
        //   {translateY: this.state.pan.y},
        //   {rotate: rotation},
        // ],
        // width: Animated.add(scale(316), wid2),
        // minWidth: scale(242),
        // maxWidth: scale(316),
        // alignSelf: 'center',
        width: this.cardWidth,
        height: this.cardHeight,
        // overflow: 'hidden',
      },
    ];
  };

  calculateStackCardZoomStyle = position => [
    styles.card,
    this.getCardStyle(),
    {
      zIndex: position * -1,
      transform: [
        {scale: this.state[`stackScale${position}`]},
        {translateY: position < 4 ? this.state[`stackPosition${position}`] : 0},
      ],
    },
  ];

  interpolateRotation = () =>
    this.state.pan.x.interpolate({
      inputRange: this.props.inputRotationRange,
      outputRange: this.props.outputRotationRange,
    });

  render = () => {
    const {
      pointerEvents,
      backgroundColor,
      marginTop,
      marginBottom,
      containerStyle,
    } = this.props;
    return (
      <View
        pointerEvents={pointerEvents}
        style={[
          styles.container,
          {
            backgroundColor: backgroundColor,
            marginTop: marginTop,
            marginBottom: marginBottom,
          },
          containerStyle,
        ]}>
        {this.renderStack()}
      </View>
    );
  };

  getCardKey = (cardContent, cardIndex) => {
    const {keyExtractor} = this.props;

    if (keyExtractor) {
      return keyExtractor(cardContent);
    }

    return cardIndex;
  };

  pushCardToStack = (renderedCards, index, position, key, firstCard) => {
    const {cards} = this.props;
    const stackCardZoomStyle = this.calculateStackCardZoomStyle(position);
    const stackCard = this.props.renderCard(
      {
        topSwipe: this.state.topSwipe,
        downSwipe: this.state.downSwipe,
        enablePanResponder: this.enablePanResponder,
        disablePanResponder: this.disablePanResponder,
      },
      index,
    );
    const swipableCardStyle = this.calculateSwipableCardStyle();
    renderedCards.push(
      <Animated.View
        key={key}
        style={firstCard ? swipableCardStyle : stackCardZoomStyle}
        {...this._panResponder.panHandlers}>
        {stackCard}
      </Animated.View>,
    );
  };

  renderStack = () => {
    const {cards, firstCardIndex, swipedAllCards} = this.state;
    const renderedCards = [];
    let {stackSize, infinite, showSecondCard} = this.props;
    let index = firstCardIndex;
    let firstCard = true;
    let cardPosition = 0;

    while (
      stackSize-- > 0 &&
      (firstCard || showSecondCard) &&
      !swipedAllCards
    ) {
      const key = this.getCardKey(cards[index], index);
      this.pushCardToStack(renderedCards, index, cardPosition, key, firstCard);

      firstCard = false;

      if (index === cards.length - 1) {
        if (!infinite) break;
        index = 0;
      } else {
        index++;
      }
      cardPosition++;
    }
    return renderedCards;
  };
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    position: 'absolute',
  },
  container: {
    alignItems: 'stretch',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  childrenViewStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayLabelWrapper: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 2,
    flex: 1,
    width: '100%',
    height: '100%',
  },
  hideOverlayLabel: {
    opacity: 0,
  },
  overlayLabel: {
    fontSize: 45,
    fontWeight: 'bold',
    borderRadius: 10,
    padding: 10,
    overflow: 'hidden',
  },
  bottomOverlayLabelWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topOverlayLabelWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightOverlayLabelWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: 30,
    marginLeft: 30,
  },
  leftOverlayLabelWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: 30,
    marginLeft: -30,
  },
});

Swiper.propTypes = {
  animateCardOpacity: PropTypes.bool,
  animateOverlayLabelsOpacity: PropTypes.bool,
  backgroundColor: PropTypes.string,
  cardHorizontalMargin: PropTypes.number,
  cardIndex: PropTypes.number,
  cardStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  cardVerticalMargin: PropTypes.number,
  cards: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  containerStyle: PropTypes.object,
  children: PropTypes.any,
  childrenOnTop: PropTypes.bool,
  dragEnd: PropTypes.func,
  dragStart: PropTypes.func,
  disableBottomSwipe: PropTypes.bool,
  disableLeftSwipe: PropTypes.bool,
  disableRightSwipe: PropTypes.bool,
  disableTopSwipe: PropTypes.bool,
  goBackToPreviousCardOnSwipeBottom: PropTypes.bool,
  goBackToPreviousCardOnSwipeLeft: PropTypes.bool,
  goBackToPreviousCardOnSwipeRight: PropTypes.bool,
  goBackToPreviousCardOnSwipeTop: PropTypes.bool,
  horizontalSwipe: PropTypes.bool,
  horizontalThreshold: PropTypes.number,
  infinite: PropTypes.bool,
  inputCardOpacityRangeX: PropTypes.array,
  inputCardOpacityRangeY: PropTypes.array,
  inputOverlayLabelsOpacityRangeX: PropTypes.array,
  inputOverlayLabelsOpacityRangeY: PropTypes.array,
  inputCardOpacityRange: PropTypes.array,
  inputRotationRange: PropTypes.array,
  keyExtractor: PropTypes.func,
  marginBottom: PropTypes.number,
  marginTop: PropTypes.number,
  onSwiped: PropTypes.func,
  onSwipedAborted: PropTypes.func,
  onSwipedAll: PropTypes.func,
  onSwipedBottom: PropTypes.func,
  onSwipedLeft: PropTypes.func,
  onSwipedRight: PropTypes.func,
  onSwipedTop: PropTypes.func,
  onSwiping: PropTypes.func,
  onTapCard: PropTypes.func,
  onTapCardDeadZone: PropTypes.number,
  outputCardOpacityRangeX: PropTypes.array,
  outputCardOpacityRangeY: PropTypes.array,
  outputOverlayLabelsOpacityRangeX: PropTypes.array,
  outputOverlayLabelsOpacityRangeY: PropTypes.array,
  outputRotationRange: PropTypes.array,
  outputCardOpacityRange: PropTypes.array,
  overlayLabels: PropTypes.object,
  overlayLabelStyle: PropTypes.object,
  overlayLabelWrapperStyle: PropTypes.object,
  overlayOpacityHorizontalThreshold: PropTypes.number,
  overlayOpacityVerticalThreshold: PropTypes.number,
  pointerEvents: PropTypes.oneOf(['box-none', 'none', 'box-only', 'auto']),
  previousCardDefaultPositionX: PropTypes.number,
  previousCardDefaultPositionY: PropTypes.number,
  renderCard: PropTypes.func.isRequired,
  secondCardZoom: PropTypes.number,
  showSecondCard: PropTypes.bool,
  stackAnimationFriction: PropTypes.number,
  stackAnimationTension: PropTypes.number,
  stackScale: PropTypes.number,
  stackSeparation: PropTypes.number,
  stackSize: PropTypes.number,
  swipeAnimationDuration: PropTypes.number,
  swipeBackCard: PropTypes.bool,
  topCardResetAnimationFriction: PropTypes.number,
  topCardResetAnimationTension: PropTypes.number,
  useViewOverflow: PropTypes.bool,
  verticalSwipe: PropTypes.bool,
  verticalThreshold: PropTypes.number,
  zoomAnimationDuration: PropTypes.number,
  zoomFriction: PropTypes.number,
};

Swiper.defaultProps = {
  animateCardOpacity: false,
  animateOverlayLabelsOpacity: false,
  backgroundColor: '#4FD0E9',
  cardHorizontalMargin: 20,
  cardIndex: 0,
  cardStyle: {},
  cardVerticalMargin: 60,
  childrenOnTop: false,
  containerStyle: {},
  disableBottomSwipe: false,
  disableLeftSwipe: false,
  disableRightSwipe: false,
  disableTopSwipe: false,
  horizontalSwipe: true,
  horizontalThreshold: width / 4,
  goBackToPreviousCardOnSwipeBottom: false,
  goBackToPreviousCardOnSwipeLeft: false,
  goBackToPreviousCardOnSwipeRight: false,
  goBackToPreviousCardOnSwipeTop: false,
  infinite: false,
  inputCardOpacityRangeX: [-width / 2, -width / 3, 0, width / 3, width / 2],
  inputCardOpacityRangeY: [-height / 2, -height / 3, 0, height / 3, height / 2],
  inputOverlayLabelsOpacityRangeX: [
    -width / 3,
    -width / 4,
    0,
    width / 4,
    width / 3,
  ],
  inputOverlayLabelsOpacityRangeY: [
    -height / 4,
    -height / 5,
    0,
    height / 5,
    height / 4,
  ],
  inputRotationRange: [-width / 2, 0, width / 2],
  keyExtractor: null,
  marginBottom: 0,
  marginTop: 0,
  onSwiped: cardIndex => {},
  onSwipedAborted: () => {},
  onSwipedAll: () => {},
  onSwipedBottom: cardIndex => {},
  onSwipedLeft: cardIndex => {},
  onSwipedRight: cardIndex => {},
  onSwipedTop: cardIndex => {},
  onSwiping: () => {},
  onTapCard: cardIndex => {},
  onTapCardDeadZone: 5,
  outputCardOpacityRangeX: [0.8, 1, 1, 1, 0.8],
  outputCardOpacityRangeY: [0.8, 1, 1, 1, 0.8],
  outputOverlayLabelsOpacityRangeX: [1, 0, 0, 0, 1],
  outputOverlayLabelsOpacityRangeY: [1, 0, 0, 0, 1],
  outputRotationRange: ['-10deg', '0deg', '10deg'],
  overlayLabels: null,
  overlayLabelStyle: {
    fontSize: 45,
    fontWeight: 'bold',
    borderRadius: 10,
    padding: 10,
    overflow: 'hidden',
  },
  overlayLabelWrapperStyle: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 2,
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlayOpacityHorizontalThreshold: width / 4,
  overlayOpacityVerticalThreshold: height / 5,
  pointerEvents: 'auto',
  previousCardDefaultPositionX: -width,
  previousCardDefaultPositionY: -height,
  secondCardZoom: 0.97,
  showSecondCard: true,
  stackAnimationFriction: 7,
  stackAnimationTension: 40,
  stackScale: 3,
  stackSeparation: 10,
  stackSize: 1,
  swipeAnimationDuration: 350,
  swipeBackCard: false,
  topCardResetAnimationFriction: 7,
  topCardResetAnimationTension: 40,
  useViewOverflow: true,
  verticalSwipe: true,
  verticalThreshold: height / 5,
  zoomAnimationDuration: 100,
  zoomFriction: 7,
};

export default Swiper;
