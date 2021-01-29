const React = require("react")

const PostBodyComponents = [
  <script
    data-goatcounter="https://iliascreates.goatcounter.com/count"
    async
    src="//gc.zgo.at/count.js"
  ></script>,
]

exports.onRenderBody = ({ setPostBodyComponents }, pluginOptions) => {
  setPostBodyComponents(PostBodyComponents)
}
