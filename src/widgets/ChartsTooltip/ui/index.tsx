import { useDetectorStore } from "../../../entities/detector/stores/useDetectorStore";
import ContentBlock from "../../../shared/ui/blocks/ContentBlock"
import Flex from "../../../shared/ui/blocks/Flex";
import InfoBlock from "../../../shared/ui/blocks/InfoBlock";
import Button from "../../../shared/ui/button/Button";
import { useChartsStore } from "../../Charts/stores/useChartsStore";

/**
 * Component for displaying a tooltip with information about the current zoomed in segment on the chart.
 *
 * @param {string} [className] Optional CSS class name for the component.
 *
 * @returns {React.ReactElement} A React element representing the component.
 */
const ChartsTooltip: React.FC<{
    className?: string
}> = (props) => {

    const lastBpmData = useDetectorStore(state => state.lastBpmData);
    const lastUterusData = useDetectorStore(state => state.lastUterusData);

    const syncZoom = useChartsStore(state => state.syncZoom);
    const clearZoom = useChartsStore(state => state.clearZoom);

    return (
        <ContentBlock className={"pt-20px! pb-20px! px-20px! flex-col gap-10px! " + props.className}>
            <Flex className="flex-row gap-10px h-full">
                <InfoBlock
                    value={`${lastBpmData ? Math.round(lastBpmData.bpm) : ''}`}
                    label="ЧСС плода"
                    className="w-full gap-0! p-20px!"
                    valueClassName="w-full text-align-right lh-24px"
                    labelClassName="lh-16px"
                />
                <InfoBlock
                    value={`${lastUterusData ? Math.round(lastUterusData.uterus) : ''}`}
                    label="Матка"
                    className="w-full gap-0! p-20px!"
                    valueClassName="w-full text-align-right lh-24px"
                    labelClassName="lh-16px"
                />
            </Flex>

            <Flex className="flex-row gap-10px h-full">
                <Button onClick={syncZoom} className="w-1/2 gap-0! p-20px! h-full">
                    <p className="p-0 m-0 color-#00A7B5 font-size-16px lh-24px">Синхронизировать</p>
                </Button>
                <Button onClick={clearZoom} className="w-1/2 gap-0! p-20px! h-full">
                    <p className="p-0 m-0 color-#00A7B5 font-size-16px lh-24px">Сбросить зум</p>
                </Button>
            </Flex>
        </ContentBlock>
    )
}

export default ChartsTooltip