import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import {useSelector} from 'react-redux';
import ProfileCard from '../../../../../components/ProfileCard';
import {scale, verticalScale} from '../../../../../configs/size';
import {tStyle} from '../../../../../configs/textStyles';

const MyCard = ({navigation}) => {
  const user = useSelector(state => state.user.data);
  const userAnswers = user?.userAnswers || [];
  const qnaObj = {};
  userAnswers.forEach(element => {
    if (element.question.category == 'VALUES') {
      qnaObj['Values & Opinion'] = [
        ...(qnaObj['Values & Opinion'] || []),
        {question: element.question.question, answer: element.answer},
      ];
    } else if (element.question.category == 'RELATIONSHIP FOCUSED') {
      qnaObj['Light Hearted'] = [
        ...(qnaObj['Light Hearted'] || []),
        {question: element.question.question, answer: element.answer},
      ];
    } else {
      qnaObj['Casual'] = [
        ...(qnaObj['Casual'] || []),
        {question: element.question.question, answer: element.answer},
      ];
    }
  });

  console.log('user', user);

  const qna = Object.keys(qnaObj).map(key => ({
    type: key,
    questions: qnaObj[key],
  }));

  return (
    <ScrollView
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'relative',
        // backgroundColor: 'yellow',
      }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}>
        <Image
          source={require('../../../../../assets/images/arrowBack.png')}
          style={{height: verticalScale(16), width: scale(8)}}
          resizeMode="contain"
        />
        <Text style={styles.text1}>Back</Text>
      </TouchableOpacity>
      <View style={{height: verticalScale(455 + 100), width: '100%'}}>
        <ProfileCard
          username={user?.username}
          selectedAvatar={user?.avatar || 0}
          answeredQues={qna}
          location={user?.city || 'unknown'}
          id={user.id}
          gender={user?.gender || ''}
          hideActionButtons={true}
          index={0}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scale(16),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(15),
  },
  text1: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 14, 19.6, '#000000'),
    marginLeft: scale(16),
  },
});

export default MyCard;
