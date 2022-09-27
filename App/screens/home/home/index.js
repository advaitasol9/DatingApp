import React, {useEffect} from 'react';
import {View, Text, Image, Pressable, StyleSheet, Modal} from 'react-native';
import {scale, verticalScale} from '../../../configs/size';
import * as Animatable from 'react-native-animatable';
import Profiles from './Profiles';
import {useSelector} from 'react-redux';

const Home = ({navigation}) => {
  const token = useSelector(state => state.user.token);
  const data = useSelector(state => state.user.data);
  console.log('to', token, data);
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Image
          source={require('../../../assets/images/chance.png')}
          height={verticalScale(33)}
          width={scale(72)}
          resizeMode="contain"
          style={{
            height: verticalScale(33),
            width: scale(72),
            // alignSelf: 'center',
            marginTop: verticalScale(12),
          }}
        />
      ),
      // headerRight: () => {
      //   return (
      //     <Pressable>
      //       <Image
      //         source={require('../../../assets/images/homeFilter.png')}
      //         height={verticalScale(20)}
      //         width={scale(20)}
      //         resizeMode="contain"
      //         style={{
      //           height: verticalScale(20),
      //           width: scale(20),
      //           marginTop: verticalScale(12),
      //           marginRight: scale(20),
      //         }}
      //       />
      //     </Pressable>
      //   );
      // },
    });
  }, []);

  return (
    <View style={styles.container}>
      <Profiles navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(8),
  },
});

export default Home;
