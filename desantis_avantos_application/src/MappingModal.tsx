import ReactDom from 'react-dom';
import { useMapperIsOpen } from './AppContext'

//todo pass node here, use same method as with prefill modal to have unique ones for each
export default function MappingModal() {
    const portalDiv = document.getElementById('mappingPortal')!;
    const mappingIsOpen = useMapperIsOpen();

    if(mappingIsOpen) {
        return ReactDom.createPortal(
            <div className="mappingContainer container vertical mGap">
                
            </div>,
            portalDiv
        );
    }
    else {
        return <></>
    }
}