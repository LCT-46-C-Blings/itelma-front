import Flex from "./Flex";

export type ContentBlockProps = {
    className?: string,
    children?: React.ReactNode
}

const ContentBlock: React.FC<ContentBlockProps> = (props) => {
    // console.log(props.className)
    return (
        <Flex className={`
            bg-#F5F5F5
            rounded-10px
            px-43px
            pt-45px
            pb-40px
            w-full
            h-full
            gap-20px
            flex-col
        ` + props.className}>
            {props.children}
        </Flex>
    )
}

export default ContentBlock;