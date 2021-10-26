import React from 'react'
import MultipleChoice from './MultipleChoice'
import Matching from './Matching'
import TrueFalse from './TrueFalse'
import FillInBlank from './FillInBlank'

export default function Question({num, text, type, correctAnswer, answerOptions}) {
    console.log(type)
    return (
        <div className='question-container'>
            <h4>Question {num}</h4>
            <h4>{type!= 'Fill in the blank' ? text : (text.split('_')[0] + "___________" + text.split('_')[1])}</h4>
            {type == 'Multiple Choice' ? <MultipleChoice correctAnswer={correctAnswer} answerOptions={answerOptions}/>
                : type == 'True/False' ? <TrueFalse correctAnswer={correctAnswer} answerOptions={answerOptions}/>
                : type == 'Matching' ? <Matching correctAnswer={correctAnswer} answerOptions={answerOptions}/>
                : <FillInBlank correctAnswer={correctAnswer} answerOptions={answerOptions}/>}
        </div>
    )
}
