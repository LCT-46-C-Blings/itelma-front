import React, { Fragment } from "react"
import Divider from "../Divider/Divider"
import Flex from "./Flex"

const ScrollBox: React.FC<{
    className?: string,
    children?: React.ReactNode,
}> = ({ className, children }) => {
    return (
        <Flex className={`flex flex-col p-24px overflow-y-scroll overflow-x-hidden gap-8px bg-white rounded-10px ${className}`}>
            {React.Children.map(children, (child, index) => {
                return (
                    <Fragment>
                        {index !== 0 ? <Divider /> : null}
                        {child}
                    </Fragment>
                )
            })}
        </Flex>
    )
}

export default ScrollBox