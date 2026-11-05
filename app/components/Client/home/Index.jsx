"use client"

import  { useRef, useState } from 'react'
import HeaderTw from '../../HeaderTw'
import SlideScrollThree from '../home/SlideScrollThree'

const IndexV2 = ({data,serviceData, projectsData, socials}) => {
   const [activeSection, setActiveSection] = useState("section1");
    const [indexToScroll, setIndexToScroll] = useState(0);
    const sectionScrollPositions = useRef({});
  return (
   <>
    <HeaderTw activeSection={activeSection} setActiveSection={setActiveSection} sectionScrollPositions={sectionScrollPositions} setIndexToScroll={setIndexToScroll} socials={socials}/>
    <SlideScrollThree data={data} serviceData={serviceData} projectsData={projectsData} socials={socials} setActiveSection={setActiveSection} activeSection={activeSection} indexToScroll={indexToScroll} setIndexToScroll={setIndexToScroll}/>
   </>
  )
}

export default IndexV2