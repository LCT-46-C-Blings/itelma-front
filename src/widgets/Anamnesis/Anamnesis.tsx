import Flex from "../../shared/ui/blocks/Flex"
import ScrollBox from "../../shared/ui/blocks/ScrollBox"
import Divider from "../../shared/ui/Divider/Divider"
import Title from "../../shared/ui/Typography/Title"

const Anamnesis: React.FC<{
    anamnesis: string[]
}> = ({ anamnesis }) => {
    return (
        <Flex className="flex-col gap-10px">
            <Title order={2}>Анамнез</Title>
            <ScrollBox className="max-h-400px" children={anamnesis.map((a, i) =>
                <>
                    <p key={i} className="p-0 m-0 font-size-16px">
                        {a}
                    </p>
                </>
            )} />
        </Flex>
    )
}

export default Anamnesis