"use client"

import { Triangle } from "react-loader-spinner"

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
        <Triangle
          visible={true}
          height="90"
          width="90"
          color="#4fa94d"
          ariaLabel="triangle-loading"
        />
      </div>
  )
}

export default Loading
