"use client"

import  { useRef, useState } from 'react'
import HeaderTw from '../../HeaderTw'
import SlideScrollThree from '../home/SlideScrollThree'

const IndexV2 = () => {
   const [activeSection, setActiveSection] = useState("section1");
    const [indexToScroll, setIndexToScroll] = useState(0);
    const sectionScrollPositions = useRef({});
  return (
   <>
    <HeaderTw activeSection={activeSection} setActiveSection={setActiveSection} sectionScrollPositions={sectionScrollPositions} setIndexToScroll={setIndexToScroll}/>
    <SlideScrollThree setActiveSection={setActiveSection} activeSection={activeSection} indexToScroll={indexToScroll} setIndexToScroll={setIndexToScroll}/>
   </>
  )
}

export default IndexV2