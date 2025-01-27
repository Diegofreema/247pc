
import {Linking, Platform, Pressable, StyleSheet, View, Text} from "react-native";
import {Entypo, FontAwesome} from "@expo/vector-icons";
import React from "react";
import {onOpenWhatsapp} from "./AuthHeader";

const text = encodeURIComponent('Hey there!')

export const Contact = () => {
    const onContactPress = async () => {
        let number = '';
        if (Platform.OS === 'ios') {
            number = 'tel:+2439011770294';
        } else {
            number = 'tel:+2439011770294';
        }
       await Linking.openURL(number);

    }
    const onEmailPress = async () => {
       await Linking.openURL('mailto:ask@247healthcare.africa');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Contact Us</Text>
          <View style={{gap: 10, marginTop: 20}}>
              <Pressable
                  onPress={onContactPress}
                  style={styles.pressable}
              >
                  <View
                      style={styles.row}
                  >
                      <Entypo name={'phone'} size={25} />
                      <Text style={styles.text}>Call us
                      </Text>
                  </View>
                  <Entypo name="chevron-right" size={24} color="black" />
              </Pressable>
              <Pressable
                  onPress={onEmailPress}
                  style={styles.pressable}
              >
                  <View
                      style={styles.row}
                  >
                      <Entypo name={'mail'} size={25} />
                      <Text style={styles.text}>Email us
                      </Text>
                  </View>
                  <Entypo name="chevron-right" size={24} color="black" />
              </Pressable>
              <Pressable
                  onPress={onOpenWhatsapp}
                  style={styles.pressable}
              >
                  <View
                      style={styles.row}
                  >
                      <FontAwesome name={'whatsapp'} size={25} />
                      <Text style={styles.text}>
                          Chat us
                      </Text>
                  </View>
                  <Entypo name="chevron-right" size={24} color="black" />
              </Pressable>
          </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontFamily: 'PoppinsBold',
        fontSize: 20,
        color: 'black'
    },
container: {
        borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#000',
    paddingTop: 10
},
    text: {
        fontFamily: 'PoppinsMedium', fontSize: 15,color: 'black'
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
    },
    pressable: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
    }
})
