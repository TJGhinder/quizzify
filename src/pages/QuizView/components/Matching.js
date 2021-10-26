import React, {useState, useEffect} from 'react'


// ! TODO: Fix matching. This does not work.

export default function Matching({answerOptions}) {


    const [selected, setSelected] = useState([])
    const [options, setOptions] = useState([])

    const [arrayOne,setArrayOne] = useState([])
    const [selectedOne,setSelectedOne] = useState([])

    const [arrayTwo,setArrayTwo] = useState([])
    const [selectedTwo,setSelectedTwo] = useState([])

    const [connectionsArray, setConnectionsArray] = useState([])

    const [previouslySelected,setPreviouslySelected] = useState('')
    const [currentlySelected,setCurrentlySelected] = useState('')

// Load and shuffle arrays
    useEffect(() => {
        let tempArrOne = []
        let tempArrTwo = []
        for (var i=0;i<answerOptions.length;i++){
            tempArrOne.push(answerOptions[i].split(',')[0])
            tempArrTwo.push(answerOptions[i].split(',')[1])
        }
        const shuffledArray = (arr) => {
            return arr.sort(() => 0.5 - Math.random());
        };
        tempArrTwo = shuffledArray(tempArrTwo)
        setArrayOne(tempArrOne)
        setArrayTwo(tempArrTwo)
    }, [])

// Handle selections
    const handleSelection = (idx,side) => {
        let idString = side.toString() + idx.toString()
        setCurrentlySelected(idString)
    }

    useEffect(() => {
        if (previouslySelected.includes('L') && currentlySelected.includes('R') || previouslySelected.includes('R') && currentlySelected.includes('L')) {
            console.log('make a connection!!')
            updateConnections(previouslySelected,currentlySelected)
            setPreviouslySelected('')
            return
        }
        setPreviouslySelected(currentlySelected)
    }, [currentlySelected])

//Update the connections array
    const updateConnections = (previouslySelected,currentlySelected) => {
        let tempConnections = []
        tempConnections.push([previouslySelected,currentlySelected])

        // If we don't already have a connection, make one. If we do, skip adding to the array.
        for (var i=0;i<connectionsArray.length;i++){
            if (connectionsArray[i][0]==currentlySelected || connectionsArray[i][1]==currentlySelected || connectionsArray[i][0]==previouslySelected || connectionsArray[i][0]==previouslySelected){
                continue;
            } else {
                tempConnections.push(connectionsArray[i])
            }
        }

        setConnectionsArray(tempConnections)
    }

    // Connect arrays once we've got a finalized list of collections.
    useEffect(() => {
        console.log(connectionsArray)
        for (let i=0;i<connectionsArray.length;i++){
            let e1 = document.getElementById(connectionsArray[i][0])
            let e2 = document.getElementById(connectionsArray[i][1])
            connect(e1, e2, 'black', 1)
        }
    }, [connectionsArray])




    function getOffset( el ) {
        let rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.pageXOffset,
            top: rect.top + window.pageYOffset,
            width: rect.width || el.offsetWidth,
            height: rect.height || el.offsetHeight
        };
    }

    const [linesToDraw,setLinesToDraw] = useState([])


    function connect(div1, div2, color, thickness) { // draw a line connecting elements
        let off1 = getOffset(div1);
        let off2 = getOffset(div2);
        
        // bottom right
        let x1 = Math.floor(off1.left + (off1.width/2) + (off1.width/4));
        let y1 = Math.floor(off1.top + off1.height/2);

        // top right
        let x2 = Math.floor(off2.left + (off2.width/2) - (off2.width/4));
        let y2 = Math.floor(off2.top + off2.height/2);


        // If we grabbed in the wrong order, switch it up!
        if (x1>x2) {
            off1 = getOffset(div2);
            off2 = getOffset(div1);
        
        // bottom right
            x1 = Math.floor(off1.left + (off1.width/2) + (off1.width/4));
            y1 = Math.floor(off1.top + off1.height/2);

        // top right
            x2 = Math.floor(off2.left + (off2.width/2) - (off2.width/4));
            y2 = Math.floor(off2.top + off2.height/2);

        }

        // distance
        let length = Math.floor(Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1))));
        // center
        let cx = Math.floor(((x1 + x2) / 2) - (length / 2));
        let cy = Math.floor(((y1 + y2) / 2) - (thickness / 2));
        // angle
        let angle = Math.floor(Math.atan2((y1-y2),(x1-x2))*(180/Math.PI));
        // make hr
        
        let styleObj = {
            padding:'0px',
            margin:'0px',
            height:`${thickness}px`,
            backgroundColor: color,
            lineHeight:'1px',
            position:'absolute',
            left:`${cx}px`,
            top:`${cy}px`,
            width:`${length}px`,
            transform:"rotate(" + `${angle}deg` + ")",
        }
        let htmlLine = <div style={styleObj}></div>

        let tempLines = [...linesToDraw]
        tempLines.push(htmlLine)
        setLinesToDraw(tempLines)
    }

    useEffect(() => {
        console.log('lines to draw:')
        console.log(linesToDraw)
    }, [linesToDraw])


    return (
        <div className='matching inputs'>

            <div className='left-side'>
            {arrayOne.map( (item,idx) => {
                return ( 
                <div id={`L${idx}`} onClick={()=>handleSelection(idx,'L')} className='input-container'>
                    <span className={currentlySelected==`L${idx}` ? 'selected-item':''}>{item}</span>
                </div>
            );})}

            </div>
            <div className='right-side'>
            {arrayTwo.map( (item,idx) => {
                return ( 
                <div id={`R${idx}`}  onClick={()=>handleSelection(idx,'R')} className='input-container'>
                    <span id={selectedTwo[idx]&'R'} className={currentlySelected==`R${idx}` ? 'selected-item' : ''}>{item}</span>
                </div>
            );})}

            </div>

            {linesToDraw.map(item => item)}

            <div id='line-container' style={{position:'absolute'}}>
                
            </div>

            

            
            
        </div>
    )
}
