/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";
import {t} from "utils/text.js";

export default function Index() {
  return (
    <>
      <IndexNavbar fixed />

      <section>
        <div className="container mx-auto items-center flex flex-wrap" style={{height:'100vh'}}>
          <div className="bg-blueGray-100 text-xl">

            {t('section')}

          </div>
        </div>
      </section>


      <Footer />
    </>
  );
}
