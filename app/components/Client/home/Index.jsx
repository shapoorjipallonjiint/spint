"use client"

import  { useRef, useState } from 'react'
import HeaderTw from '../../HeaderTw'
import SlideScrollThree from '../home/SlideScrollThree'

// heroVideo / heroPoster: the rotating hero video picked by HomeV2 (see SlideScrollThree)
const IndexV2 = ({data,serviceData, projectsData, socials, heroVideo, heroPoster}) => {
   const [activeSection, setActiveSection] = useState("section1");
    const [indexToScroll, setIndexToScroll] = useState(0);
    const sectionScrollPositions = useRef({});
  return (
   <>
    <HeaderTw activeSection={activeSection} setActiveSection={setActiveSection} sectionScrollPositions={sectionScrollPositions} setIndexToScroll={setIndexToScroll} socials={socials}/>
    <SlideScrollThree data={data} serviceData={serviceData} projectsData={projectsData} socials={socials} setActiveSection={setActiveSection} activeSection={activeSection} indexToScroll={indexToScroll} setIndexToScroll={setIndexToScroll} heroVideo={heroVideo} heroPoster={heroPoster}/>
   </>
  )
}

export default IndexV2