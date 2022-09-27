import React, {useState, useRef} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {RadioButton} from 'react-native-paper';

import {scale, verticalScale} from '../../../configs/size';
import {tStyle} from '../../../configs/textStyles';

const OptionsModal = ({unMatch, reportAndBlock, username = 'your match'}) => {
  const [showReportReason, setShowReportReason] = useState(false);
  const [reportReasonSelected, setReportReasonSelected] =
    useState('Not my type');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showUnmatchModal, setShowUnmatchModal] = useState(false);
  const [showHideProfileModal, setShowHideProfileModal] = useState(false);

  const reportReasons = [
    'Not my type',
    'Personality doesn’t match',
    'Spam Account',
    'Inappropriate content',
    'Offline Behaviour',
  ];

  return (
    <View style={styles.container}>
      {!showReportReason &&
        !showReportModal &&
        !showUnmatchModal &&
        !showHideProfileModal && (
          <>
            {/* <TouchableOpacity style={styles.btn}>
              <Icon
                type="ionicon"
                name="videocam"
                color="#000000"
                size={scale(24)}
              />
              <View style={{marginLeft: scale(24)}}>
                <Text style={styles.text1}>Video Call</Text>
                <Text style={styles.text2}>
                  Connect virtually with your connection
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} /> */}
            <TouchableOpacity
              style={styles.btn}
              onPress={() => setShowHideProfileModal(true)}>
              <Icon
                type="ionicon"
                name="eye-off"
                color="#000000"
                size={scale(24)}
              />
              <View style={{marginLeft: scale(24)}}>
                <Text style={styles.text1}>Hide Public Information</Text>
                <Text style={styles.text2}>
                  Hide your public photos, details and other information
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.btn}
              onPress={() => setShowUnmatchModal(true)}>
              <Icon
                type="ionicon"
                name="close-circle"
                color="#000000"
                size={scale(24)}
              />
              <View style={{marginLeft: scale(24)}}>
                <Text style={styles.text1}>Unmatch</Text>
                <Text style={styles.text2}>
                  {`Both you and ${username} won’t be able to talk anymore`}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.btn}
              onPress={() => setShowReportReason(true)}>
              <Icon
                type="ionicon"
                name="alert-circle"
                color="#EB5757"
                size={scale(24)}
              />
              <View style={{marginLeft: scale(24)}}>
                <Text style={{...styles.text1, color: '#EB5757'}}>Report</Text>
                <Text
                  style={styles.text2}>{`Block and report ${username}`}</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      {showReportReason && (
        <>
          {reportReasons.map((res, i) => (
            <TouchableOpacity
              style={{
                ...styles.btn,
                borderBottomWidth: i != reportReasons.length - 1 ? 1 : 0,
                borderColor: '#E3E3E3',
              }}
              onPress={() => setReportReasonSelected(res)}>
              <RadioButton.Android
                value={reportReasonSelected === res}
                status={reportReasonSelected === res ? 'checked' : 'unchecked'}
                onPress={() => setReportReasonSelected(res)}
                color="#333333"
                uncheckedColor="#333333"
              />
              <Text style={styles.text1}>{res}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => {
              setShowReportReason(false);
              setShowReportModal(false);
              reportAndBlock(reportReasonSelected || 'abc');
            }}>
            <Text style={styles.text3}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setShowReportReason(false)}>
            <Text style={styles.text4}>cancel</Text>
          </TouchableOpacity>
        </>
      )}
      {showReportModal && (
        <>
          <Text style={styles.text5}>Report {username}?</Text>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => {
              setShowReportModal(false);
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                type="ionicon"
                name="alert-circle"
                color="#fff"
                size={scale(20)}
                style={{marginRight: scale(8)}}
              />
              <Text style={styles.text3}>Report</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setShowReportModal(false)}>
            <Text style={styles.text4}>cancel</Text>
          </TouchableOpacity>
        </>
      )}
      {showUnmatchModal && (
        <>
          <Text style={styles.text5}>Unmatch {username}?</Text>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => {
              setShowUnmatchModal(false);
              unMatch();
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                type="ionicon"
                name="close-circle"
                color="#fff"
                size={scale(20)}
                style={{marginRight: scale(8)}}
              />
              <Text style={styles.text3}>Unmatch</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setShowUnmatchModal(false)}>
            <Text style={styles.text4}>cancel</Text>
          </TouchableOpacity>
        </>
      )}
      {showHideProfileModal && (
        <>
          <Text style={styles.text5}>Hide public information?</Text>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => {
              setShowHideProfileModal(false);
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                type="ionicon"
                name="eye-off"
                color="#fff"
                size={scale(20)}
                style={{marginRight: scale(8)}}
              />
              <Text style={styles.text3}>Hide</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setShowHideProfileModal(false)}>
            <Text style={styles.text4}>cancel</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: scale(15),
    borderTopRightRadius: scale(15),
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(8),
  },
  btn: {
    paddingVertical: verticalScale(16),
    marginRight: scale(32),
    flexDirection: 'row',
    alignItems: 'center',
  },
  text1: {
    ...tStyle('Manrope-SemiBold', '500', 'normal', 16, 21.8, '#333333'),
  },
  text2: {
    ...tStyle('Manrope-Regular', '400', 'normal', 12, 16.4, '#33333380'),
  },
  divider: {
    marginHorizontal: scale(20),
    borderBottomWidth: 1,
    borderColor: '#E3E3E3',
  },
  submitBtn: {
    width: scale(300),
    height: verticalScale(55),
    borderRadius: scale(8),
    alignSelf: 'center',
    backgroundColor: '#EB5757',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text3: {
    ...tStyle('Manrope-Bold', '600', 'normal', 16, 21.8, '#fff'),
  },
  text4: {
    ...tStyle('Manrope-Regular', '400', 'normal', 16, 21.8, '#333333'),
  },
  cancelBtn: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(16),
    alignSelf: 'center',
  },
  text5: {
    ...tStyle('Manrope-Bold', '600', 'normal', 18, 24.5, '#333333'),
    marginBottom: verticalScale(16),
    alignSelf: 'center',
    marginTop: verticalScale(8),
  },
});

export default OptionsModal;
