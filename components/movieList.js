import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from "react-native";
import React from "react";
import { styles } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { fallbackMoviePoster, image185 } from "../api/moviedb";

export default function MovieList({ title, data, hideSeeAll }) {
  var { width, height } = Dimensions.get("window");
  const navigation = useNavigation();
  return (
    <View className="mb-8 space-y-4">
      <View className="mx-4 flex-row justify-between items-center">
        <Text className="text-white text-xl">{title}</Text>
        {!hideSeeAll && (
          <TouchableOpacity>
            <Text style={styles.text} className="text-lg">
              See All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* upcoming  Movies list */}
      <ScrollView
        horizontal
        scrollIndicatorInsets={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {data.map((item, index) => {
          return (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => navigation.push("Movie", item)}
            >
              <View className="space-y-1 mr-4">
                <Image
                  // source={require("../assets/Images/moviePoster2.png")}
                  source={{
                    uri: image185(item.poster_path) || fallbackMoviePoster,
                  }}
                  style={{ height: height * 0.22, width: width * 0.33 }}
                  className="rounded-3xl"
                />
                <Text className="text-neutral-300 ml-1">
                  {item?.title?.length > 14
                    ? item.title.slice(0, 14) + " ..."
                    : item.title}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
      </ScrollView>
    </View>
  );
}
