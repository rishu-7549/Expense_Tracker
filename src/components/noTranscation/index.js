import React from 'react'
import transcations from "../../assests/transcations.svg"

function NoTranscation() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
        marginBottom: "2rem",

      }}
    >
      <img src={transcations} style={{ width: "400px", margin: "4rem" }} />
      <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
        You Have No Transactions Currently
      </p>

    </div >
  )
}

export default NoTranscation
