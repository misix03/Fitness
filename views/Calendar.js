import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, Alert} from 'react-native';
import {Calendar as ReactNativeCalendar} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeTraingins = async (trainings) => {
  try {
    const jsonValue = JSON.stringify(trainings);
    await AsyncStorage.setItem('@trainings', jsonValue);
  } catch (e) {
    // saving error
    console.log(e);
  }
};

export const Calendar = () => {
  const [dates, setDates] = useState({});

  const addDate = useCallback(
    (date) => {
      const trainings = {
        ...dates,
        ...{[date]: {selected: true, selectedColor: '#90ee90'}},
      };
      setDates(trainings);
      storeTraingins(trainings);
    },
    [dates],
  );

  const removeDate = useCallback(
    (date) => {
      const trainings = {...dates};
      delete trainings[date];
      setDates(trainings);
      storeTraingins(trainings);
    },
    [dates],
  );

  const onDayPress = useCallback(
    ({dateString}) => {
      if (dates[dateString]) {
        Alert.alert(
          'Remove Training Day',
          'Are you sure you want to remove training day?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {text: 'OK', onPress: () => removeDate(dateString)},
          ],
          {cancelable: true},
        );
      } else {
        Alert.alert(
          'Add Training Day',
          'Are you sure you want to add training day?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {text: 'OK', onPress: () => addDate(dateString)},
          ],
          {cancelable: true},
        );
      }
    },
    [dates],
  );

  useEffect(() => {
    (async () => {
      try {
        const trainings = await AsyncStorage.getItem('@trainings');

        if (trainings !== null) {
          setDates(JSON.parse(trainings));
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <View>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 30,
          marginBottom: 20,
          marginTop: 20,
        }}>
        Trainings
      </Text>
      <View style={{flexShrink: 0}}>
        <ReactNativeCalendar markedDates={dates} onDayPress={onDayPress} />
      </View>
    </View>
  );
};
