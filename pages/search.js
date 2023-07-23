import {
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { XMarkIcon } from "react-native-heroicons/outline";
import Loading from "../components/loading";
import { debounce } from "lodash";
import { fallbackMoviePoster, image185, searchMovies } from "../api/moviedb";
var { width, height } = Dimensions.get("window");

export default function SearchScreen() {
  const navigation = useNavigation();
  const [results, setResults] = useState([]);
  const [isloading, setLoading] = useState(false);

  const handleSearch = (value) => {
    if (value && value.length > 2) {
      setLoading(true);
      searchMovies({
        query: value,
        include_adults: "false",
        language: "en-US",
        page: "1",
      }).then((data) => {
        setLoading(false);
        console.log("Got movies: ", data);
        if (data) setResults(data.results);
      });
    } else {
      setLoading(false);
      setResults([]);
    }
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);
  return (
    <SafeAreaView className="bg-neutral-800 flex-1">
      <View className=" mx-4 p-2 mb-3 flex-row justify-between items-center border border-neutral-500 rounded">
        <TextInput
          onChangeText={handleTextDebounce}
          placeholder="Search Movies"
          placeholderTextColor={"lightgrey"}
          className="pb-1 pl-6 flex-1 text-base font-semibold text-white tracking-wider"
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Home");
          }}
          className="rounded p-1 m-1 bg-neutral-500"
        >
          <XMarkIcon size={25} color={"white"} />
        </TouchableOpacity>
      </View>

      {isloading ? (
        <Loading />
      ) : results.length > 0 ? (
        // search result
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          className="space-y-3"
        >
          <Text className="text-white font-semibold ml-1">
            Results({results.length})
          </Text>
          <View className="flex-row justify-between flex-wrap">
            {results.map((item, index) => {
              return (
                <TouchableWithoutFeedback
                  key={index}
                  onPress={() => navigation.push("Movie", item)}
                >
                  <View className=" space-y-2 mb-4">
                    <Image
                      className="rounded-3xl"
                      // source={require("../assets/Images/moviePoster2.png")}
                      source={{
                        uri: image185(item?.poster_path || fallbackMoviePoster),
                      }}
                      style={{ height: height * 0.3, width: width * 0.44 }}
                    />
                    <Text className=" text-neutral-300 ml-1">
                      {item?.title.length > 24
                        ? item?.title.slice(0, 24) + "..."
                        : item?.title}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-row justify-center">
          <Image
            className="h-96 w-96"
            source={require("../assets/Images/movieTime.png")}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
