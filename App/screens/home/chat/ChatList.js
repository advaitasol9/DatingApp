import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import {Icon, Input} from 'react-native-elements';
import moment from 'moment';
import {useSelector} from 'react-redux';
import io from 'socket.io-client';

import {scale, verticalScale} from '../../../configs/size';
import {apiUrl, tempUrl, socketUrl} from '../../../configs/constants';
import {tStyle} from '../../../configs/textStyles';
import ChatBox from './ChatBox';
import OptionsModal from './OptionsModal';
import ProfileModal from './ProfileModal';
import RevealSent from '../../../components/RevealSent';
import RevealReceived from '../../../components/RevealReceived';

const ChatList = ({navigation, route}) => {
  const [currentChatUser, setCurrentChatUser] = useState({});
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [matchedPeople, setMatchedPeople] = useState([]);
  const [newMatches, setNewMatches] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [newIncoming, setNewIncoming] = useState({});

  const timeNow = moment(new Date()).format('LT');
  const avatarArray = useSelector(state => state.user.avatarArray);
  const token = useSelector(state => state.user.token);
  const me = useSelector(state => state.user.data);

  const getMatches = () => {
    const filter = encodeURI(
      JSON.stringify({where: {matchStatus: 'matched', isBlocked: false}}),
    );
    fetch(`${apiUrl}/match?filter=${filter}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        var tempArr1 = [];
        var tempArr2 = [];
        data.map(item => {
          if (item?.id == route.params?.matchedUser?.id) {
            if (item?.realProfile && !route.params?.hasRealProfile) {
              navigation.setParams({
                matchedUser: item,
                hasRealProfile: true,
              });
            }
          } else if (item?.id == currentChatUser?.id) {
            setCurrentChatUser(item);
          }
          if (item?.lastMessage) tempArr1.push(item);
          else tempArr2.push(item);
        });
        setMatchedPeople(tempArr1);
        setNewMatches(tempArr2);
      })
      .catch(err => console.log('err', err));
  };

  useEffect(getMatches, [navigation, route]);

  useEffect(() => {
    if (!searchInput) {
      // console.log('matchedPeople', matchedPeople);
      setFilteredPeople(matchedPeople);
    } else {
      var tempArr = matchedPeople.filter(user =>
        user?.matchedUser?.username
          .toLowerCase()
          .includes(searchInput.toLowerCase()),
      );
      setFilteredPeople(tempArr);
    }
  }, [searchInput, matchedPeople]);

  const unMatch = async () => {
    try {
      const currentUser = route.params?.matchedUser || currentChatUser;

      const body = {
        matchId: currentUser?.id,
        reason: 'abc',
      };
      const res = await fetch(`${apiUrl}/match/unmatch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      navigation.setParams({showChatBox: false, matchedUser: null});
      setShowOptionsModal(false);
      await getMatches();
    } catch (err) {
      console.log('err', err);
    }
  };

  const block = async () => {
    try {
      const currentUser = route.params?.matchedUser || currentChatUser;

      const body = {
        blockAgainst: currentUser?.matchedUser?.id,
        reason: 'abc',
        extra: {},
      };
      const res = await fetch(`${apiUrl}/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      console.log('res', res);
      const data = await res.json();
      console.log('datata', data?.error?.details);
      setShowOptionsModal(false);
    } catch (err) {
      console.log('err', err);
    }
  };

  const report = async reason => {
    try {
      const currentUser = route.params?.matchedUser || currentChatUser;

      const body = {
        reportAgainst: currentUser?.matchedUser?.id,
        reason: reason,
        extra: {},
      };
      const res = await fetch(`${apiUrl}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      console.log('body', body);
      console.log('res', res);
      const data = await res.json();
      console.log('datata', data?.error?.details);
      setShowOptionsModal(false);
    } catch (err) {
      console.log('err', err);
    }
  };

  const reportAndBlock = async reason => {
    try {
      await block();
      await report(reason);
      navigation.setParams({showChatBox: false, matchedUser: null});
      await getMatches();
    } catch (error) {
      console.log('error report and block', error);
    }
  };

  // newMatches.forEach(item => console.log('m', item));

  const socketRef = useRef(null);

  useEffect(() => {
    // console.log('token', token);
    if (socketRef.current == null) {
      socketRef.current = io(socketUrl, {
        query: {
          token,
        },
      });
    }
    var {current: socket} = socketRef;
    try {
      socket.on('connect', function (params) {
        console.log('on connect: ', params);
        setConnected(true);
      });

      socket.on('error', function (params, x) {
        setConnected(false);
        console.log('on error: ', params, x);
      });
      socket.on('connect_error', function (msg) {
        setConnected(false);
        console.log('connect_error', msg);
      });
      socket.on('disconnect', function (msg) {
        setConnected(false);
        console.log('disconnect', msg);
        // socket.connect();
      });
    } catch (err) {
      console.log('some error', err);
    }
    return () => {
      socket?.removeAllListeners();
    };
  }, []);

  const reFetchMatches = data => {
    console.log('checking');
    if (
      route.params?.showChatBox &&
      connected &&
      data.data.notifiationType == 'chat'
    ) {
      return;
    }
    ('getting matches');
    getMatches();
  };

  useEffect(() => {
    if (connected) {
      socketRef.current.on('/notification', data => {
        console.log('incoming text', JSON.stringify(data));
        setNewIncoming(data);
        reFetchMatches(data);
      });
    }
  }, [connected]);

  return (
    <View style={styles.container}>
      {matchedPeople.length > 0 || newMatches.length > 0 ? (
        <>
          <View style={styles.topContainer}>
            <Text style={styles.text1}>New Connections</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {[...newMatches, ...matchedPeople].map(user => (
                <TouchableOpacity
                  style={{marginRight: scale(26), alignItems: 'center'}}
                  onPress={() => {
                    setCurrentChatUser(user);
                    navigation.setParams({showChatBox: true});
                  }}>
                  <View
                    style={{
                      ...styles.imgWrapper,
                      backgroundColor:
                        avatarArray[user?.matchedUser?.avatar || 2]
                          .backgroundColor,
                    }}>
                    <Image
                      source={{
                        uri: avatarArray[user?.matchedUser?.avatar || 2].image,
                      }}
                      style={{height: verticalScale(42), width: scale(49)}}
                      resizeMode="contain"
                    />
                    {!user?.lastMessage && <View style={styles.redDot} />}
                  </View>
                  <Text style={styles.text2}>
                    {user?.matchedUser?.username}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View
            style={[
              styles.bottomContainer,
              {
                borderTopLeftRadius: newMatches?.length ? scale(20) : 0,
                borderTopRightRadius: newMatches?.length ? scale(20) : 0,
              },
            ]}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.text3}>Messages</Text>
                {/* <View style={styles.msgCount}>
                  <Text style={styles.text4}>1</Text>
                </View> */}
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.searchWrapper}>
                  <View style={{marginRight: scale(-10)}}>
                    <Icon
                      type="ionicon"
                      name="search-outline"
                      color="#200E32"
                      size={scale(20)}
                    />
                  </View>
                  <Input
                    value={searchInput}
                    onChangeText={val => setSearchInput(val)}
                    placeholder="Search"
                    placeholderTextColor="#000"
                    inputContainerStyle={styles.inputCont}
                    style={styles.text5a}
                    inputStyle={styles.text5a}
                  />
                </View>
                {/* <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: scale(10),
                  }}>
                  <Image
                    source={require('../../../assets/images/homeFilter.png')}
                    resizeMode="contain"
                    style={{height: scale(20), width: scale(20)}}
                  />
                  <Text style={styles.text5}>Filter</Text>
                </TouchableOpacity> */}
              </View>
            </View>
            <View style={styles.chatPreviewWrapper}>
              {filteredPeople.length > 0 ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {filteredPeople.map((user, i) => {
                    const msgTime = moment(user?.lastMessage?.updatedAt)
                      .local()
                      .format('HH:mm');
                    const isRequestOpen =
                      user?.revealRequest?.responseStatus == 'pending';
                    const isRequestReceived =
                      user?.revealRequest?.reqTo == me.id;
                    return (
                      <TouchableOpacity
                        style={{
                          ...styles.chatPreview,
                          borderBottomWidth:
                            i + 1 != filteredPeople.length ? 1 : 0,
                        }}
                        onPress={() => {
                          setCurrentChatUser(user);
                          navigation.setParams({showChatBox: true});
                        }}>
                        <View
                          style={{
                            ...styles.profilePic,
                            backgroundColor:
                              avatarArray[user?.matchedUser?.avatar || 2]
                                .backgroundColor,
                          }}>
                          <Image
                            source={{
                              uri: avatarArray[user?.matchedUser?.avatar || 2]
                                .image,
                            }}
                            style={{
                              height: verticalScale(44),
                              width: scale(51),
                            }}
                            resizeMode="contain"
                          />
                        </View>
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text style={styles.text6}>
                              {user?.matchedUser?.username}
                            </Text>
                            {isRequestOpen && !isRequestReceived && (
                              <RevealSent />
                            )}
                          </View>
                          <Text style={styles.text7} numberOfLines={1}>
                            {user?.lastMessage?.message}
                          </Text>
                        </View>
                        <View style={styles.timeWrapper}>
                          <Text style={styles.text8}>{msgTime}</Text>
                          {isRequestOpen && isRequestReceived ? (
                            <RevealReceived />
                          ) : user?.unreadMessageCount?.count ? (
                            <View style={styles.msgCount2}>
                              <Text style={styles.text9}>
                                {user?.unreadMessageCount?.count}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                        <Text></Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              ) : (
                <View
                  style={{
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    resizeMode="contain"
                    style={{height: verticalScale(145), width: scale(150)}}
                    source={require('../../../assets/images/group.png')}
                  />
                  <Text style={styles.text10}>No conversations yet !</Text>
                </View>
              )}
            </View>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Image
            resizeMode="contain"
            style={{height: verticalScale(145), width: scale(150)}}
            source={require('../../../assets/images/group.png')}
          />
          <Text style={styles.text10}>Oh crap, no new matches yet!</Text>
          <TouchableOpacity style={styles.startBtn}>
            <Text style={styles.text11}>Start Swiping</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        animationIn="fadeIn"
        animationInTiming={1}
        animationOutTiming={1}
        style={{margin: 0}}
        isVisible={route.params?.showChatBox}
        onBackButtonPress={() => {
          if (showOptionsModal || showProfileModal) return;
          navigation.setParams({showChatBox: false, matchedUser: null});
        }}>
        <ChatBox
          currenChatUser={route.params?.matchedUser || currentChatUser}
          showOptions={() => setShowOptionsModal(true)}
          hideChatBox={() =>
            navigation.setParams({showChatBox: false, matchedUser: null})
          }
          showProfileModal={() => setShowProfileModal(true)}
          navigate={() => {
            navigation.setParams({showChatBox: false, matchedUser: null});
            setShowProfileModal(false);
            navigation.navigate('Profile', {screen: 'Revealed'});
          }}
          getMatches={getMatches}
          connected={connected}
          newIncoming={newIncoming}
        />
        <Modal
          isVisible={showOptionsModal}
          style={{margin: 0}}
          onBackButtonPress={() => setShowOptionsModal(false)}>
          <TouchableOpacity
            activeOpacity={1}
            style={{flex: 1}}
            onPress={() => setShowOptionsModal(false)}></TouchableOpacity>
          <OptionsModal
            unMatch={unMatch}
            reportAndBlock={reportAndBlock}
            username={
              route.params?.matchedUser?.matchedUser.username ||
              currentChatUser?.matchedUser?.username
            }
          />
        </Modal>
        <Modal
          isVisible={showProfileModal}
          style={{margin: 0}}
          onBackButtonPress={() => setShowProfileModal(false)}>
          <TouchableOpacity
            activeOpacity={1}
            style={{flex: 1}}
            onPress={() => setShowProfileModal(false)}></TouchableOpacity>
          <ProfileModal
            currentChatUser={route.params?.matchedUser || currentChatUser}
            navigate={() => {
              navigation.setParams({showChatBox: false, matchedUser: null});
              setShowProfileModal(false);
              navigation.navigate('Profile', {screen: 'Revealed'});
            }}
            getMatches={getMatches}
          />
        </Modal>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF9FD',
  },
  text1: {
    ...tStyle('Manrope-Bold', '600', 'normal', 12, 16.8, '#000000'),
    marginBottom: verticalScale(8),
  },
  imgWrapper: {
    height: scale(54),
    width: scale(54),
    borderRadius: scale(54),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  text2: {
    ...tStyle('Halant-Regular', '400', 'normal', 10, 14, '#525258'),
    marginTop: verticalScale(9),
  },
  topContainer: {
    paddingLeft: scale(20),
    paddingTop: verticalScale(17),
    marginBottom: verticalScale(10),
  },
  bottomContainer: {
    flex: 1,
    borderTopRightRadius: scale(20),
    borderTopLeftRadius: scale(20),
    paddingTop: verticalScale(16),
    paddingHorizontal: scale(20),
    backgroundColor: '#fff',
  },
  text3: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 12, 16.8, '#000000'),
  },
  msgCount: {
    marginLeft: scale(7),
    height: scale(18),
    width: scale(18),
    borderRadius: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2994A',
  },
  text4: {
    ...tStyle('Manrope-Bold', '700', 'normal', 10, 14, '#fff'),
  },
  text5: {
    ...tStyle('Manrope-Regular', '400', 'normal', 10, 14, '#000000'),
    marginLeft: scale(4),
  },
  text5a: {
    ...tStyle('Manrope-Regular', '400', 'normal', 10, 14, '#000000'),
  },
  chatPreviewWrapper: {
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(100),
  },
  chatPreview: {
    paddingVertical: verticalScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#CCCCCC',
  },
  profilePic: {
    height: scale(56),
    width: scale(56),
    borderRadius: scale(56),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  text6: {
    ...tStyle('Manrope-Bold', '600', 'normal', 18, 20, '#000000'),
  },
  text7: {
    ...tStyle('Manrope-Regular', '400', 'normal', 10, 14, '#000000'),
    maxWidth: scale(225),
  },
  text8: {
    ...tStyle('Manrope-Regular', '400', 'normal', 10, 13.6, '#6D6D6D'),
  },
  text9: {
    ...tStyle('Manrope-Bold', '700', 'normal', 10, 14, '#000000'),
  },
  msgCount2: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF9FD',
    marginTop: verticalScale(6),
  },
  timeWrapper: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text10: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 16, 20, '#181636CC'),
    marginTop: verticalScale(8),
  },
  startBtn: {
    width: scale(300),
    height: verticalScale(56),
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#87B2E5',
    marginTop: verticalScale(24),
  },
  text11: {
    ...tStyle('Manrope-Bold', '700', 'normal', 16, 21.8, '#fff'),
  },
  inputCont: {
    borderBottomWidth: 0,
    height: verticalScale(20),
    width: scale(60),
    margin: 0,
    padding: 0,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: scale(70),
    maxHeight: verticalScale(20),
  },
  redDot: {
    height: scale(8),
    width: scale(8),
    backgroundColor: '#EB5757',
    borderRadius: scale(4),
    position: 'absolute',
    right: scale(-4),
    top: scale(23),
  },
});

export default ChatList;
