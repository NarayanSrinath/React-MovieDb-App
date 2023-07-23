import {
  View,
  Text,
  Platform,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { theme } from "../theme";
import { ArrowSmallLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import MovieList from "../components/movieList";
import Loading from "../components/loading";
import {
  fallbackPersonImage,
  fetchPersonDetails,
  fetchPersonMovies,
  image342,
} from "../api/moviedb";

const ios = Platform.OS == "ios";

var { width, height } = Dimensions.get("window");
const verticalmargin = ios ? "" : "my-3";
export default function PersonScreen() {
  const { params: item } = useRoute();
  const [isFav, togglefav] = useState(false);
  const [personMovies, setPersonMovies] = useState([]);
  const [person, setPerson] = useState([]);
  const navigation = useNavigation();
  const [isloading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    console.log("person:", item);
    getPersonDetails(item.id);
    getPersonMovies(item.id);
  }, [item]);

  const getPersonDetails = async (id) => {
    const data = await fetchPersonDetails(id);
    console.log("person details:", data);
    setLoading(false);
    if (data) setPerson(data);
  };
  const getPersonMovies = async (id) => {
    const data = await fetchPersonMovies(id);
    console.log("person movies:", data);
    setLoading(false);
    if (data && data.cast) setPersonMovies(data.cast);
  };
  return (
    <ScrollView
      className="flex-1 bg-neutral-900"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <SafeAreaView
        className={
          "flex-row justify-between items-center mx-4 z-10 " + verticalmargin
        }
      >
        {/* Arrow */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: "#eab308" }}
          className="rounded-xl p-2 "
        >
          <ArrowSmallLeftIcon size={25} strokeWidth={2.5} color="black" />
        </TouchableOpacity>
        {/* Heart */}

        <TouchableOpacity onPress={() => togglefav(!isFav)}>
          <HeartIcon size={35} color={isFav ? "red" : "#fff"} />
        </TouchableOpacity>
      </SafeAreaView>
      {isloading ? (
        <Loading />
      ) : (
        <View>
          {/* Person Details */}
          <View className="flex-row justify-center p-4">
            <Image
              className="rounded-2xl h-24 w-20"
              // source={require("../assets/Images/castImage2.png")}
              source={{
                uri: image342(person?.profile_path) || fallbackPersonImage,
              }}
              style={{ height: height * 0.43, width: width * 0.74 }}
            />
          </View>
          {/* name  and place */}
          <View className="mt-6">
            <Text className="text-3xl text-white font-bold text-center">
              {person?.name}
            </Text>
            <Text className="text-base text-neutral-500 text-center">
              {person?.place_of_birth}
            </Text>
          </View>
          {/* stats */}
          <View className="mx-3 p-2 mt-6 flex-row justify-between items-center bg-neutral-700 rounded">
            <View className=" border-r-2 border-r-neutral-400, px-4 items-center ">
              <Text className=" text-white font-semibold">Gender</Text>
              <Text className=" text-neutral-300 text-sm">
                {person?.gender == 1 ? "Female" : "Male"}
              </Text>
            </View>
            <View className=" border-r-2 border-r-neutral-400, px-4 items-center">
              <Text className=" text-white font-semibold">Popularity</Text>
              <Text className=" text-neutral-300 text-sm">
                {" "}
                {person?.popularity}
              </Text>
            </View>
            <View className=" border-r-2 border-r-neutral-400, px-4 items-center">
              <Text className=" text-white font-semibold">Brithday</Text>
              <Text className=" text-neutral-300 text-sm">
                {person?.birthday}
              </Text>
            </View>
            <View className="px-4 items-center">
              <Text className=" text-white font-semibold">Known for</Text>
              <Text className=" text-neutral-300 text-sm">
                {" "}
                {person?.known_for_department}
              </Text>
            </View>
          </View>
          <View className="my-6 mx-4 space-y-2">
            <Text className="text-white text-lg">Biography</Text>
            <Text className="text-neutral-400 tracking-wide">
              {person?.biography || "N/A"}
            </Text>
          </View>
          {/* movieList */}
          <MovieList title="Known For" data={personMovies} hideSeeAll={true} />
        </View>
      )}
    </ScrollView>
  );
}
