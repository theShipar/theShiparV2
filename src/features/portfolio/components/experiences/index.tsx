import React from "react"

import { EXPERIENCES } from "../../data/experiences"
import { Panel, PanelHeader, PanelTitle } from "../panel"
import { ExperienceItem } from "./experience-item"

export function Experiences() {
  return (
    <Panel id="experience">
      <PanelHeader>
        <PanelTitle>
          Experience
          <sup className="-top-[0.75em] ml-1 text-sm font-medium tracking-normal text-muted-foreground">
            (5 yrs)
          </sup>
        </PanelTitle>
      </PanelHeader>

      <div className="pr-2 pl-4">
        {EXPERIENCES.map((experience) => (
          <ExperienceItem key={experience.id} experience={experience} />
        ))}
      </div>
    </Panel>
  )
}
