import React, {useState, useEffect} from 'react'

export default function TrueFalse() {
    
    const [selected, setSelected] = useState([false, false])
    const [options, setOptions] = useState(['True', 'False'])

    const handleSelection = (idx) => {
        let tempSelected = []
        for (let i=0;i<selected.length;i++){
            i==idx ? tempSelected.push(true) : tempSelected.push(false)
        }
        setSelected(tempSelected)
    }
    

    return (
        <div className='multiple-choice inputs'>

            {selected.map( (item,idx) => {
                return ( 
                <div className='input-container'>
                    <input onChange={() => handleSelection(idx)} className='input' type="radio" value="option1" checked={item} /><span>{options[idx]}</span>
                </div>
            );})}
            
        </div>
    )
}
