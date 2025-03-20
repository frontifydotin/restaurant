import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Main from "@/components/Home";
import { RestaurantContextProvider } from "@/contexts/CommonContext";

export default function Home() {
  return (
    <RestaurantContextProvider>
    <div className="font-extrabold">
      {/* <Header></Header> */}
      <Main/>
      {/* <Footer /> */}
    </div>
    </RestaurantContextProvider>
  );
}







// function MyApp({ Component, pageProps }) {
//   return (
//     <RestaurantContextProvider>
//       <Component {...pageProps} />
//     </RestaurantContextProvider>
//   );
// }

// export default MyApp;
