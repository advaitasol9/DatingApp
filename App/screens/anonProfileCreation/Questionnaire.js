import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  Modal as RNModal,
  BackHandler,
  Animated,
} from 'react-native';
import {Button, Input} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import size, {moderateScale, scale, verticalScale} from '../../configs/size';
import {apiUrl} from '../../configs/constants';
import {tStyle} from '../../configs/textStyles';
import colors from '../../configs/colors';
import * as Animatable from 'react-native-animatable';
import {useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import EnterNumber from '../onboarding/Login';

const Questionnaire = ({navigation, route}) => {
  const [showAnsField, setShowAnsField] = useState(false);
  const [quesSelected, setQuesSelected] = useState('');
  const [answer, setAnswer] = useState('');
  const [qnaList, setQnaList] = useState([]);
  const [quesType, setQuesType] = useState('casual');
  const [showForwardBtn, setShowForwardBtn] = useState(false);
  const [currentQuesArray, setCurrentQuesArray] = useState([]);
  const [causalQuestions, setCasualQuestion] = useState([]);
  const [lightHeartedQuestions, setLightHeartedQuestions] = useState([]);
  const [valuesQuestions, setValuesQuestions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const progressBarWidth = useState(new Animated.Value(scale(300)))[0];
  const token = useSelector(state => state.user.token);
  const data = useSelector(state => state.user.data);

  const changeProgressBar = val => {
    Animated.timing(progressBarWidth, {
      toValue: scale(320 + val),
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    changeProgressBar(0);
  }, []);

  useEffect(() => {
    fetch(`${apiUrl}/questions/fetch`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data =>
        data.forEach(entry => {
          if (entry.category == 'CASUAL') {
            var tempArr = [];
            entry.questions.forEach(ent =>
              tempArr.push({
                question: ent.question,
                id: ent.id,
                demoanswer: ent?.demoanswer || '',
              }),
            );
            setCasualQuestion(tempArr);
          }
          if (entry.category == 'RELATIONSHIP FOCUSED') {
            var tempArr = [];
            entry.questions.forEach(ent =>
              tempArr.push({
                question: ent.question,
                id: ent.id,
                demoanswer: ent?.demoanswer || '',
              }),
            );
            setLightHeartedQuestions(tempArr);
          }
          if (entry.category == 'VALUES') {
            var tempArr = [];
            entry.questions.forEach(ent =>
              tempArr.push({
                question: ent.question,
                id: ent.id,
                demoanswer: ent?.demoanswer || '',
              }),
            );
            setValuesQuestions(tempArr);
          }
        }),
      )
      .catch(err => console.log('err', err));
  }, []);

  useEffect(() => setCurrentQuesArray(causalQuestions), [causalQuestions]);

  const postAnswers = async () => {
    try {
      var body = [];
      qnaList.forEach(item =>
        body.push({
          answer: item.answer,
          questionId: item.id,
        }),
      );
      const res = await fetch(`${apiUrl}/user/me/save-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data?.error)
        throw new Error(
          'Error updating answers! Check your internet connection.',
        );
    } catch (err) {
      alert(err);
      console.log('err', err);
    }
  };

  useEffect(() => {
    var res = false;
    qnaList.forEach(item => {
      if (item.type === quesType) res = true;
    });
    setShowForwardBtn(res);
  }, [qnaList, currentQuesArray]);

  const checkAnswered = ques => {
    var res = false;
    qnaList.forEach(item => {
      if (item.question === ques) res = true;
    });
    return res;
  };

  const getAnswer = ques => {
    var res = '';
    qnaList.forEach(item => {
      if (item.question === ques) res = item.answer;
    });
    return res;
  };

  const saveAnsHandler = () => {
    if (!answer) {
      setShowAnsField(false);
      return;
    }
    var currentList = qnaList;
    currentList.push({
      question: quesSelected.question,
      answer,
      type: quesType,
      id: quesSelected.id,
    });
    setQnaList(currentList);
    setShowAnsField(false);
    setAnswer('');
    setQuesSelected('');
    setShowForwardBtn(true);
  };

  var quesTypeViewRef;

  const renderQuesType = () => {
    var imagePath;
    var textToShow;
    if (quesType === 'casual') {
      imagePath = require('../../assets/images/casual.png');
      textToShow = 'Casual';
    }
    if (quesType === 'lightHearted') {
      imagePath = require('../../assets/images/heart.png');
      textToShow = 'Light Hearted';
    }
    if (quesType === 'values') {
      imagePath = require('../../assets/images/values.png');
      textToShow = 'Values';
    }
    return (
      <Animatable.View
        style={styles.imgContainer}
        animation="zoomIn"
        ref={ref => (quesTypeViewRef = ref)}>
        <Image
          source={imagePath}
          style={{
            height: verticalScale(20),
            width: verticalScale(20),
            marginLeft: quesType === 'values' ? 5 : 0,
          }}
        />
        <Text
          style={{
            ...styles.text3,
            marginLeft: quesType === 'values' ? scale(4) : scale(8),
          }}>
          {textToShow}
        </Text>
      </Animatable.View>
    );
  };

  const forwarHandler = async () => {
    if (quesType === 'casual') {
      setQuesType('lightHearted');
      setCurrentQuesArray(lightHeartedQuestions);
      quesTypeViewRef.animate('zoomIn');
      changeProgressBar(10);
    }
    if (quesType === 'lightHearted') {
      setQuesType('values');
      setCurrentQuesArray(valuesQuestions);
      quesTypeViewRef.animate('zoomIn');
      changeProgressBar(20);
    }
    if (quesType === 'values') {
      BackHandler.removeEventListener('hardwareBackPress', backPressHandler);
      await postAnswers();
      setModalVisible(true);
    }
  };

  const backPressHandler = useCallback(() => {
    if (quesType === 'casual') {
      return false;
    } else if (quesType === 'lightHearted') {
      setQuesType('casual');
      setCurrentQuesArray(causalQuestions);
      return true;
    } else if (quesType === 'values') {
      setQuesType('lightHearted');
      setCurrentQuesArray(lightHeartedQuestions);
      return true;
    } else return false;
  }, [quesType, currentQuesArray]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backPressHandler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backPressHandler);
    };
  }, [backPressHandler]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={{
              ...styles.progressBarFill,
              width: progressBarWidth,
            }}></Animated.View>
        </View>
        <Text style={styles.text1}>Answer any one question</Text>
        <Text style={styles.text2}>
          Let the real you find the real suitable for you
        </Text>
        {renderQuesType()}
      </View>
      <ScrollView contentContainerStyle={styles.bottomContainer}>
        {currentQuesArray.map(ques =>
          checkAnswered(ques.question) ? (
            <TouchableOpacity
              style={styles.questionContainer2}
              onPress={() => {
                setShowAnsField(true);
                setQuesSelected(ques);
                setAnswer(getAnswer(ques.question));
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: verticalScale(5),
                }}>
                <Image
                  source={require('../../assets/images/select.png')}
                  style={{height: verticalScale(10), width: verticalScale(10)}}
                />
                <Text style={styles.orangeText}>A N S W E R E D</Text>
              </View>
              <View>
                <Animatable.Text
                  style={styles.text4a}
                  animation="flipInX"
                  duration={1000}>
                  {ques.question}
                </Animatable.Text>
              </View>
              <View style={styles.ansContainer}>
                <Animatable.Text
                  style={styles.ansText}
                  numberOfLines={1}
                  animation="slideInLeft"
                  duration={500}>
                  {getAnswer(ques.question)}
                </Animatable.Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.questionContainer}
              onPress={() => {
                setShowAnsField(true);
                setQuesSelected(ques);
              }}>
              <Text style={styles.text4}>{ques.question}</Text>
            </TouchableOpacity>
          ),
        )}
      </ScrollView>
      <RNModal
        visible={showAnsField}
        transparent={true}
        onRequestClose={() => setShowAnsField(false)}>
        <View style={styles.modalPopup}>
          <Text style={styles.popupQuesText}>{quesSelected.question}</Text>
          <Animatable.View
            style={styles.inputPopup}
            animation="slideInLeft"
            duration={500}>
            <Animatable.View
              style={styles.inputBox}
              animation="slideInDown"
              duration={500}>
              <Input
                style={styles.inputTextStyle}
                inputContainerStyle={{borderBottomWidth: 0}}
                value={answer}
                onChangeText={val => setAnswer(val)}
                multiline={true}
                textAlignVertical="top"
                scrollEnabled={true}
                placeholder={quesSelected.demoanswer}
              />
              <Text style={styles.text5}>{200 - answer.length}/200</Text>
            </Animatable.View>
            <Animatable.View
              style={{
                flexDirection: 'row',
                height: verticalScale(37),
              }}
              animation="slideInDown"
              duration={500}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setAnswer('');
                  setShowAnsField(false);
                }}>
                <Image source={require('../../assets/images/cancel.png')} />
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveAnsHandler}>
                <Image source={require('../../assets/images/select.png')} />
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </Animatable.View>
          </Animatable.View>
        </View>
      </RNModal>
      {showForwardBtn ? (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: verticalScale(24),
            alignSelf: 'center',
          }}
          onPress={forwarHandler}>
          <Image
            source={require('../../assets/images/arrowRight.png')}
            style={{height: verticalScale(40), width: verticalScale(40)}}
          />
        </TouchableOpacity>
      ) : null}
      <Modal
        isVisible={route.params?.showOtpModal || modalVisible}
        onBackdropPress={() => {
          setModalVisible(false);
          navigation.setParams({showOtpModal: false});
        }}
        style={{margin: 0, justifyContent: 'flex-end'}}>
        <EnterNumber
          navigate={() => navigation.navigate('FinalQuesScreen', route.params)}
          closeModal={() => {
            setModalVisible(false);
            navigation.setParams({showOtpModal: false});
          }}
          navigation={navigation}
          fullSize={true}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBar: {
    height: verticalScale(6),
    width: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: '#D7EBF7',
  },
  progressBarFill: {
    height: verticalScale(6),
    width: scale(320),
    backgroundColor: '#3BA2E4',
  },
  topContainer: {
    height: verticalScale(132),
    paddingTop: verticalScale(46),
    alignItems: 'center',
    backgroundColor: colors.pastel.blue,
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
    marginBottom: verticalScale(33),
  },
  text1: {
    ...tStyle('Manrope-Regular', '700', 'normal', 20, 22, '#000000'),
    marginBottom: verticalScale(10),
  },
  text2: {
    ...tStyle('Manrope-Regular', '500', 'normal', 12, 16.8, '#666666'),
  },
  imgContainer: {
    position: 'absolute',
    bottom: scale(-14),
    height: verticalScale(28),
    borderRadius: scale(40),
    padding: scale(4),
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#F0C7FF',
    backgroundColor: '#FAEFFE',
  },
  text3: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 15, 18, '#181636'),
    marginLeft: scale(8),
  },
  bottomContainer: {
    flexGrow: 1,
    paddingBottom: verticalScale(33),
    paddingHorizontal: scale(16),
  },
  text4: {
    ...tStyle('Manrope-Regular', '500', 'normal', 12, 16.8, '#6D6D6D'),
  },
  text4a: {
    ...tStyle('Manrope-Regular', '400', 'normal', 12, 16.8, '#000000'),
  },
  popupQuesText: {
    ...tStyle('Manrope-Regular', '400', 'normal', 12, 16.8, '#000000'),
    opacity: 1,
    backgroundColor: '#fff',
    paddingBottom: verticalScale(23),
  },
  questionContainer: {
    height: verticalScale(75),
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#EBEBEB',
  },
  questionContainer2: {
    borderBottomWidth: 1,
    borderColor: '#EBEBEB',
  },
  ansContainer: {
    height: verticalScale(65),
    justifyContent: 'center',
  },
  orangeText: {
    ...tStyle('Manrope-Regular', '600', 'normal', 10, 14, '#F2994A'),
    marginLeft: scale(4),
  },
  modalPopup: {
    height: '100%',
    zIndex: 1,
    position: 'absolute',
    top: verticalScale(185),
    left: 0,
    right: 0,
    opacity: 0.9,
    backgroundColor: '#fff',
    paddingHorizontal: scale(16),
  },
  inputPopup: {
    height: verticalScale(182),
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: scale(8),
    backgroundColor: '#fff',
    opacity: 1,
    overflow: 'hidden',
  },
  inputBox: {
    height: verticalScale(145),
  },
  inputTextStyle: {
    height: verticalScale(145),
    ...tStyle('Halant-Medium', '500', 'normal', 24, 33.6, '#333333'),
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAFFEA',
  },
  cancelText: {
    ...tStyle('Manrope-Regular', '500', 'normal', 14, 19.6, '#D23535'),
    marginLeft: scale(8),
  },
  saveText: {
    ...tStyle('Manrope-Regular', '500', 'normal', 14, 19.6, '#25CB71'),
    marginLeft: scale(8),
  },
  text5: {
    position: 'absolute',
    bottom: verticalScale(20),
    right: 12,
    ...tStyle('Halant-Regular', '400', 'normal', 12, 16.8, '#2C2626'),
  },
  ansText: {
    ...tStyle('Halant-SemiBold', '600', 'normal', 16, 22.4, '#000000'),
  },
});

export default Questionnaire;
