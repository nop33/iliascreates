import React from "react";

import Intro from "../components/intro";
import Layout from "../components/layout";
import SEO from "../components/seo";

const Music = ({ location }) => {
  return (
    <Layout location={location}>
      <SEO
        title="I play with music | Ilias creates"
        description="Music is a vital part of my life. I enjoy creating audiovisual experiences by curating and mixing electronic music."
      />
      <Intro>
        A huge chunk of my awake time is spent listening to music.
        <br />I enjoy a lot curating tracks and creating{" "}
        <a href="https://open.spotify.com/user/11101912794/playlists">
          Spotify playlists
        </a>{" "}
        as well as sewing them together with my DJ controller to create{" "}
        <a href="https://soundcloud.com/imfetamin/tracks">
          hours-long musical experiences
        </a>
        .
      </Intro>
    </Layout>
  );
};

export default Music;
