const React = require("react")

const PostBodyComponents = [
  <script
    dangerouslySetInnerHTML={{
      __html: `if (window.location.host !== 'iliascreates.com') window.goatcounter = {no_onload: true}`,
    }}
  />,
  <script
    data-goatcounter="https://iliascreates.goatcounter.com/count"
    async
    src="//gc.zgo.at/count.js"
  ></script>,
]

exports.onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents(PostBodyComponents)
}
