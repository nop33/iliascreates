import React from "react"
import djSetStyles from "./dj-sets.module.scss"

export default function DjSet({ children }) {
  return (
    <div className={djSetStyles.djSet}>
      <p>{children}</p>
    </div>
  )
}
