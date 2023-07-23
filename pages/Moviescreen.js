import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowSmallLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "../components/cast";
import MovieList from "../components/movieList";
import Loading from "../components/loading";
import {
  fallbackMoviePoster,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
  image500,
} from "../api/moviedb";

const ios = Platform.OS == "ios";
var { width, height } = Dimensions.get("window");
const topMargin = ios ? "" : "mt-3";

export default function Moviescreen() {
  const { params: item } = useRoute();
  const [isFav, togglefav] = useState(false);
  const [cast, setCast] = useState([]);
  const [relatedMovies, setRelatedMovies] = useState([1, 2, 3, 4, 5]);
  const [movieDetails, setMovieDetails] = useState([]);
  const [isloading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    console.log("item:", item.id);
    setLoading(true);
    getMovieDetails(item.id);
    getMovieCerdits(item.id);
    getSimilarMovies(item.id);
    // api call for details api
  }, [item]);

  const getMovieDetails = async (id) => {
    const data = await fetchMovieDetails(id);
    console.log("got movie details:", data);
    setLoading(false);
    if (data) setMovieDetails(data);
  };
  const getMovieCerdits = async (id) => {
    const data = await fetchMovieCredits(id);
    console.log("got movie Cerdits:", data);
    setLoading(false);
    if (data.cast) setCast(data.cast);
  };
  const getSimilarMovies = async (id) => {
    const data = await fetchSimilarMovies(id);
    console.log("got Similar movies:", data);
    setLoading(false);
    if (data && data.results) setRelatedMovies(data.results);
  };
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      className="flex-1 bg-neutral-900"
    >
      {/* back button and moview poster */}
      <SafeAreaView
        className={
          "absolute z-20 w-full flex-row justify-between item-center px-4" +
          topMargin
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
          <HeartIcon size={35} color={isFav ? theme.background : "#fff"} />
        </TouchableOpacity>
      </SafeAreaView>

      {isloading ? (
        <Loading />
      ) : (
        <View>
          <View>
            {/* movie poster */}

            <Image
              // source={require("../assets/Images/moviePoster2.png")}
              source={{
                uri: image500(movieDetails?.poster_path) || fallbackMoviePoster,
              }}
              style={{ height: height * 0.55, width: width }}
              className="rounded-3xl"
            />

            <LinearGradient
              colors={[
                "transparent",
                "rgba(22, 22, 22,0.9)",
                "rgba(23, 23, 23, 1)",
              ]}
              style={{ width, height: height * 0.4 }}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              className="absolute bottom-0"
            />
          </View>
          <View>
            {/* movie details */}
            <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
              {/* Title */}
              <Text className="text-white text-center text-3xl font-bold tracking-wider">
                {movieDetails?.title}
              </Text>

              {/* status realse runtime */}
              {movieDetails?.id ? (
                <Text className="text-neutral-400 font-semibold text-base text-center">
                  {movieDetails?.status} •{" "}
                  {movieDetails?.release_date?.split("-")[0]} •{" "}
                  {movieDetails?.runtime} min
                </Text>
              ) : null}

              {/* geners */}
              <View className="flex-row justify-center mx-4 space-x-2">
                {movieDetails?.genres?.map((genre, index) => {
                  let showDot = index + 1 != movieDetails.genres.length;
                  return (
                    <Text
                      key={index}
                      className="text-neutral-400 font-semibold text-base text-center"
                    >
                      {genre?.name} {showDot ? "•" : null}
                    </Text>
                  );
                })}
              </View>
              {/* description */}
              <Text className="text-neutral-400 mx-4 tracking-wide">
                {movieDetails?.overview}
              </Text>
            </View>

            {/* Cast */}
            {movieDetails?.id && cast.length > 0 && (
              <Cast navigation={navigation} cast={cast} />
            )}

            {/* Similar movies */}
            {/* {movieDetails?.id && relatedMovies.length > 0 && ( */}
            <MovieList
              title={"Similar Movies"}
              hideSeeAll={true}
              data={relatedMovies}
            />
            {/* ) */}
            {/* } */}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
