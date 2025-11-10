import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return<div>
          <Toaster
           position="top-center"
            reverseOrder={true}
          />
      <main>
        <Component {...pageProps} />
      </main>
    </div>;;
}
