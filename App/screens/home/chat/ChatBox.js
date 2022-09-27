import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Alert,
} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import io from 'socket.io-client';

import {scale, verticalScale} from '../../../configs/size';
import {tStyle} from '../../../configs/textStyles';
import {useSelector} from 'react-redux';
import {apiUrl, socketUrl, tempUrl} from '../../../configs/constants';
import {GiftedChat} from 'react-native-gifted-chat';
import moment from 'moment';

const formatMessageForGiftedChat = (item, index) => {
  // console.log('item in format', item, typeof item);

  return {
    _id: item.messageId,
    text: item.message,
    createdAt: item.createdAt,
    user: {
      _id: item.senderId,
    },
    index,
  };
};

const ChatBox = ({
  currenChatUser,
  showOptions,
  hideChatBox,
  showProfileModal,
  navigate,
  getMatches,
  newIncoming,
  connected,
}) => {
  const [chatInput, setChatInput] = useState('');
  const [chats, setChats] = useState([]);
  const [revealRequested, setRevealRequested] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [chatsLoaded, setChatsLoaded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [unreadMessage, setUnreadMessage] = useState([]);

  const avatarArray = useSelector(state => state.user.avatarArray);
  const token = useSelector(state => state.user.token);
  const userInfo = useSelector(state => state.user.data);

  const chatUserAvatar = currenChatUser?.matchedUser?.avatar;
  const chatUserName = currenChatUser?.matchedUser?.username;

  const inputRef = useRef();

  const chatStarters = [
    'Why are you devil smiley?',
    'Do you like star wars?',
    'Why are you devil smiley?',
  ];

  useFocusEffect(
    useCallback(() => {
      if (!currenChatUser?.revealRequest) setRevealRequested(false);
      if (currenChatUser?.revealRequest?.responseStatus == 'pending')
        setRevealRequested(true);
      if (currenChatUser?.isRevealed) setIsRevealed(true);
    }, [currenChatUser]),
  );

  const socketRef = useRef(null);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsFocused(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsFocused(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // useEffect(() => {
  //   // console.log('token', token);
  //   if (socketRef.current == null) {
  //     socketRef.current = io(socketUrl, {
  //       query: {
  //         token,
  //       },
  //     });
  //   }
  //   var {current: socket} = socketRef;
  //   try {
  //     socket.on('connect', function (params) {
  //       console.log('on connect: ', params);
  //       setConnected(true);
  //     });

  //     socket.on('error', function (params, x) {
  //       setConnected(false);
  //       console.log('on error: ', params, x);
  //     });
  //     socket.on('connect_error', function (msg) {
  //       setConnected(false);
  //       console.log('connect_error', msg);
  //     });
  //     socket.on('disconnect', function (msg) {
  //       setConnected(false);
  //       console.log('disconnect', msg);
  //       // socket.connect();
  //     });
  //   } catch (err) {
  //     console.log('some error', err);
  //   }
  //   return () => {
  //     socket?.removeAllListeners();
  //   };
  // }, []);

  // useEffect(() => {
  //   if (connected) {
  //     socket.on('/notification', data => {
  //       console.log('incoming text', JSON.stringify(data));
  //       var newMessage;
  //       if (data.data?.message) {
  //         newMessage = formatMessageForGiftedChat(data.data);
  //       } else {
  //         newMessage = formatMessageForGiftedChat({...data.data, message: ''});
  //       }
  //       // console.log('new message', newMessage);
  //       setChats(
  //         GiftedChat.append({...newMessage, index: chats.length}, chats),
  //       );
  //     });
  //   }
  // }, [chats, connected]);

  useEffect(() => {
    console.log('msg data', newIncoming);
    if (!newIncoming || Object.keys(newIncoming).length == 0) return;
    if (
      newIncoming.notifiationType == 'chat' &&
      newIncoming.data?.senderId != currenChatUser?.matchedUser?.id
    )
      return;
    if (
      newIncoming.notifiationType == 'revealRequest' &&
      newIncoming.data?.reqFrom != currenChatUser?.matchedUser?.id
    )
      return;
    var newMessage;
    if (newIncoming.notifiationType == 'chat') {
      newMessage = formatMessageForGiftedChat({
        ...newIncoming.data,
      });
      markMessagesSeen();
    }
    if (newIncoming.notifiationType == 'revealRequest') {
      newMessage = formatMessageForGiftedChat({
        ...newIncoming.data,
        message: '',
      });
    }
    // console.log('new message', newMessage);
    if (newMessage)
      setChats(GiftedChat.append({...newMessage, index: chats.length}, chats));
  }, [newIncoming]);

  useEffect(() => {
    if (!currenChatUser || !currenChatUser?.id) return;
    const filter = encodeURI(
      JSON.stringify({where: {matchId: currenChatUser.id}}),
    );
    fetch(`${apiUrl}/chat?filter=${filter}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        var currentChats = [];
        const unReadMessages = [];
        data.forEach((item, index) => {
          currentChats.push(formatMessageForGiftedChat(item, index));
        });
        markMessagesSeen();
        setChatsLoaded(true);
        setChats(currentChats);
      })
      .catch(err => console.log('err', err));
  }, [currenChatUser]);

  const sendMessageHandler = async message => {
    const newMessage = formatMessageForGiftedChat({
      senderId: userInfo.id,
      message: message,
      createdAt: new Date(),
      messageId: Date.now(),
    });
    setChats(GiftedChat.append({...newMessage, index: chats.length}, chats));
    setChatInput();
    const body = {
      matchId: currenChatUser?.id,
      message: message,
    };
    fetch(`${apiUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
      .then(res => {
        // console.log('res', res);
        return res.json();
      })
      .then(data => {
        // console.log('data', data)
      })
      .catch(err => console.log('err', err));
  };

  const markMessagesSeen = () => {
    fetch(`${tempUrl}/chat/mark-seen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        matchId: currenChatUser?.id,
      }),
    })
      .then(res => {
        // console.log('res mark-seen', res);
        return res.json();
      })
      .then(data => {
        // console.log('data', data)
      })
      .catch(err => console.log('err while mark seen', err));
  };

  const reqResponse = async res => {
    if (
      res == 'accept' &&
      (!userInfo?.realProfile || !Object.keys(userInfo?.realProfile).length)
    ) {
      Alert.alert('Not yet!', 'Create your public profile first.', [
        {text: 'OK', onPress: navigate},
      ]);
    } else {
      try {
        const body = {
          userId: currenChatUser?.matchedUser?.id,
          response: res,
        };
        const response = await fetch(`${apiUrl}/profile/request`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        getMatches();
      } catch (err) {
        console.log('err', err);
      }
    }
  };

  const renderChats = ({currentMessage: item, nextMessage}) => {
    const myMessage = item.user._id === userInfo.id;
    const isSameDay = nextMessage.createdAt
      ? moment(item.createdAt).isSame(nextMessage.createdAt, 'date')
      : true;
    // console.log('texttttt', item, item.text);
    return (
      <View key={item._id}>
        {item.index == 0 && (
          <Text style={styles.day}>{moment(item.createdAt).format('LL')}</Text>
        )}
        <View
          style={[
            myMessage ? styles.sentMessage : styles.recievedMessage,
            item.text ? {} : {backgroundColor: '#FFF0F0'},
          ]}>
          <Text style={styles.text4}>
            {item.text ||
              `${chatUserName} requested to view your public profile`}
          </Text>
        </View>
        {item.text ? null : (
          <View style={styles.btnWrapper}>
            <TouchableOpacity
              style={styles.declineBtn}
              onPress={() => reqResponse('reject')}>
              <Icon
                type="ionicon"
                name="close-circle"
                color="#D23535"
                size={scale(14)}
              />
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => reqResponse('accept')}>
              <Icon
                type="ionicon"
                name="checkmark-circle"
                color="#25CB71"
                size={scale(14)}
              />
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text
          style={[
            styles.msgTime,
            {alignSelf: myMessage ? 'flex-end' : 'flex-start'},
          ]}>
          {moment(item.createdAt).format('LT')}
        </Text>
        {!isSameDay && (
          <Text style={styles.day}>
            {moment(nextMessage.createdAt).format('LL')}
          </Text>
        )}
      </View>
    );
  };

  const renderTextInput = () => (
    <View style={styles.typeBox}>
      <Input
        ref={inputRef}
        value={chatInput}
        onChangeText={val => setChatInput(val)}
        containerStyle={styles.inputContainerStyle}
        inputContainerStyle={{borderBottomWidth: 0}}
        inputStyle={styles.inputText}
        placeholder="Type here..."
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        {isRevealed && (
          <Icon
            type="ionicon"
            name="attach-outline"
            color="#000000"
            size={verticalScale(20)}
            style={{transform: [{rotate: '45deg'}]}}
          />
        )}
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={() => {
            if (chatInput == '') return;
            sendMessageHandler(chatInput);
            setChatInput('');
            // Keyboard.dismiss();
            // listRef.current._listRef._scrollRef.scrollToEnd({
            //   animating: true,
            // });
          }}>
          <Icon
            type="ionicon"
            name="send"
            color="#000000"
            size={verticalScale(16)}
            style={{transform: [{rotate: '-45deg'}]}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const profilePictures = currenChatUser?.matchedUser?.realProfile?.photos;
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: avatarArray[chatUserAvatar || 2].backgroundColor,
      }}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={hideChatBox}>
          <Icon type="ionicon" name="chevron-back-outline" color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarBg} onPress={showProfileModal}>
          <Image
            source={{
              uri: profilePictures
                ? profilePictures.split(',')[0]
                : avatarArray[chatUserAvatar || 2].image,
            }}
            resizeMode={profilePictures ? 'cover' : 'contain'}
            style={
              profilePictures
                ? {height: verticalScale(56), width: scale(56)}
                : {height: verticalScale(34), width: scale(41)}
            }
          />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} onPress={showProfileModal}>
          <Text style={styles.text1}>
            {`${connected}`}
            {/* {currenChatUser?.matchedUser?.realProfile?.name || chatUserName} */}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {isRevealed ? null : (
              <Image
                source={
                  revealRequested
                    ? require('../../../assets/images/anon2.png')
                    : require('../../../assets/images/anon.png')
                }
                resizeMode="contain"
                style={{height: verticalScale(6), width: scale(16)}}
              />
            )}
            {isRevealed ? (
              <Text style={styles.text5a}>View Profile</Text>
            ) : revealRequested ? (
              <Text style={styles.text5}>Pending Request</Text>
            ) : (
              <Text style={styles.text2}>Request Profile</Text>
            )}
          </View>
        </TouchableOpacity>
        {/* <View style={{position: 'absolute', right: scale(50)}}>
          <Icon type="ionicon" name="call" color="#000000" />
        </View> */}
        <TouchableOpacity
          style={{position: 'absolute', right: scale(12)}}
          onPress={showOptions}>
          <Icon type="ionicon" name="ellipsis-vertical" color="#000000" />
        </TouchableOpacity>
      </View>
      {chatsLoaded && (
        <View style={styles.chatContainer}>
          <GiftedChat
            messages={chats}
            user={{
              _id: userInfo.id,
            }}
            renderMessage={renderChats}
            inverted={false}
            renderInputToolbar={renderTextInput}
            minInputToolbarHeight={verticalScale(96)}
            minComposerHeight={verticalScale(96)}
          />
        </View>
      )}
      {/* <FlatList
          style={{flex: 1, marginBottom: verticalScale(82)}}
          ref={listRef}
          data={chats}
          onScroll={() => {}}
          scrollEventThrottle={100}
          renderItem={renderChats}
          inverted={true}
          keyExtractor={(item, index) => `${index}`}
          onEndReached={() => {}}
          onEndReachedThreshold={0.5}
        />
        <View style={styles.typeBox}>
          <Input
            value={chatInput}
            onChangeText={val => setChatInput(val)}
            containerStyle={styles.inputContainerStyle}
            inputContainerStyle={{borderBottomWidth: 0}}
            inputStyle={styles.inputText}
            placeholder="Type here..."
          />
          <View>
            <Icon
              type="ionicon"
              name="attach-outline"
              color="#000000"
              size={verticalScale(20)}
              style={{transform: [{rotate: '45deg'}]}}
            />
          </View>
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => {
              if (chatInput == '') return;
              sendMessageHandler(chatInput);
              setChatInput('');
              Keyboard.dismiss();
              listRef.current._listRef._scrollRef.scrollToEnd({
                animating: true,
              });
            }}>
            <Icon
              type="ionicon"
              name="send"
              color="#000000"
              size={verticalScale(16)}
              style={{transform: [{rotate: '-45deg'}]}}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* {chats.length === 0 && (
        <View style={styles.suggestionBox}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {chatStarters.map(chat => (
              <TouchableOpacity
                style={styles.suggestedChat}
                onPress={() => sendMessageHandler(chat)}>
                <Text style={styles.text4}>{chat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )} */}
      {chats.length === 0 && !isFocused && (
        <View style={styles.wrapper}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                ...styles.imgWrapper,
                backgroundColor:
                  avatarArray[chatUserAvatar || 2].backgroundColor,
              }}>
              <Image
                source={{
                  uri: avatarArray[chatUserAvatar || 2].image,
                }}
                resizeMode="contain"
                style={{height: verticalScale(46), width: scale(56)}}
              />
            </View>
            <View
              style={{
                ...styles.imgWrapper,
                backgroundColor:
                  avatarArray[userInfo?.avatar || 0].backgroundColor,
                marginLeft: scale(-25),
                borderWidth: 3,
              }}>
              <Image
                source={{uri: avatarArray[userInfo?.avatar || 0].image}}
                resizeMode="contain"
                style={{height: verticalScale(46), width: scale(56)}}
              />
            </View>
          </View>
          <Text style={styles.text3}>Let the fun begin</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
  },
  avatarBg: {
    height: verticalScale(56),
    width: verticalScale(56),
    borderRadius: verticalScale(56),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight: scale(8),
    overflow: 'hidden',
  },
  text1: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 24, 30, '#333333'),
  },
  text2: {
    ...tStyle('Manrope-Regular', '500', 'normal', 12, 15, '#333333'),
    marginLeft: scale(4),
  },
  text5: {
    ...tStyle('Manrope-Regular', '500', 'normal', 12, 15, '#EB5757'),
    marginLeft: scale(4),
  },
  text5a: {
    ...tStyle('Manrope-Regular', '500', 'normal', 12, 15, '#333333CC'),
  },
  chatContainer: {
    flex: 1,
    borderTopRightRadius: scale(25),
    borderTopLeftRadius: scale(25),
    backgroundColor: '#fff',
    paddingTop: verticalScale(10),
  },
  imgWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(84),
    width: scale(84),
    borderRadius: scale(150),
    borderColor: '#fff',
  },
  wrapper: {
    alignSelf: 'center',
    paddingVertical: verticalScale(20),
    position: 'absolute',
    top: verticalScale(235),
  },
  typeBox: {
    width: scale(320),
    height: verticalScale(56),
    alignSelf: 'center',
    // position: 'absolute',
    marginBottom: verticalScale(18),
    bottom: verticalScale(-16),
    borderRadius: scale(12),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
  },
  inputContainerStyle: {
    width: '77%',
    alignItems: 'center',
    height: verticalScale(40),
    paddingLeft: 0,
  },
  inputText: {
    ...tStyle('Manrope-SemiBold', '500', 'normal', 16, 22.4, '#333333'),
    alignSelf: 'center',
  },
  sendBtn: {
    backgroundColor: '#F5F7FB',
    height: scale(40),
    width: scale(40),
    borderRadius: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginLeft: scale(5),
  },
  text3: {
    ...tStyle('Manrope-SemiBold', '500', 'normal', 16, 22.4, '#000000'),
    alignSelf: 'center',
  },
  suggestionBox: {
    width: '100%',
    height: verticalScale(48),
    position: 'absolute',
    bottom: verticalScale(82),
  },
  suggestedChat: {
    height: verticalScale(48),
    paddingHorizontal: scale(12),
    borderRadius: scale(100),
    backgroundColor: '#EDF7F8',
    marginHorizontal: scale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text4: {
    ...tStyle('Manrope-SemiBold', '500', 'normal', 12, 15.6, '#333333'),
  },
  sentMessage: {
    minHeight: verticalScale(18),
    maxWidth: scale(264),
    paddingLeft: scale(18),
    paddingRight: scale(12),
    paddingVertical: verticalScale(16),
    borderRadius: scale(100),
    borderTopRightRadius: 0,
    backgroundColor: '#EDF7F8',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: scale(16),
    marginLeft: scale(20),
  },
  recievedMessage: {
    minHeight: verticalScale(18),
    maxWidth: scale(264),
    paddingLeft: scale(12),
    paddingRight: scale(18),
    paddingVertical: verticalScale(16),
    borderRadius: scale(100),
    borderTopLeftRadius: 0,
    backgroundColor: '#ebecf0',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: scale(16),
    marginRight: scale(20),
  },
  msgTime: {
    fontFamily: 'Manrope-Regular',
    fontSize: 8,
    color: '#89898D',
    marginHorizontal: scale(28),
  },
  day: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: '#89898D',
    alignSelf: 'center',
    marginVertical: verticalScale(8),
  },
  btnWrapper: {
    width: scale(328),
    height: verticalScale(37),
    marginBottom: verticalScale(6),
    flexDirection: 'row',
    marginLeft: scale(16),
  },
  declineBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF0F0',
    flex: 1,
    borderTopLeftRadius: scale(8),
    borderBottomLeftRadius: scale(8),
  },
  acceptBtn: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAFFEA',
    flex: 1,
    borderTopRightRadius: scale(8),
    borderBottomRightRadius: scale(8),
  },
  declineText: {
    ...tStyle('Manrope-Refular', '500', 'normal', 14, 18.8, '#D23535'),
    marginLeft: scale(4),
  },
  acceptText: {
    ...tStyle('Manrope-Refular', '500', 'normal', 14, 18.8, '#25CB71'),
    marginLeft: scale(4),
  },
});

export default ChatBox;
