import React from "react";

import Boxes from "../components/boxes";
import Intro from "../components/intro";
import Layout from "../components/layout";
import Seo from "../components/seo";

import appsData from "../../content/data/apps.yaml";

const Apps = ({ location }) => {
  return (
    <Layout location={location}>
      <Seo
        title="I build apps | Ilias creates"
        description="A list of apps that I have built."
      />
      <Intro>
        <p>
          These are some of the apps that I built in my free time to solve
          personal challenges.
        </p>
        <Boxes boxesData={appsData} />
      </Intro>
    </Layout>
  );
};

export default Apps;
