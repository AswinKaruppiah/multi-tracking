// Let third-party components accept NativeWind `className`.
import { Image } from "expo-image";
import { cssInterop } from "nativewind";

cssInterop(Image, { className: "style" });
