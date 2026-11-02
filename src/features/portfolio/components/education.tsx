import { EXPERIENCES } from "../data/experiences"
import { ExperiencePositionItem } from "./experiences/experience-position-item"
import { Panel, PanelHeader, PanelTitle } from "./panel"

export function Education() {
  const education = EXPERIENCES.find((item) => item.id === "education")
  if (!education) return null
  return (
    <Panel id="education">
      <PanelHeader>
        <PanelTitle>Education</PanelTitle>
      </PanelHeader>
      <div className="space-y-4 p-4">
        {education.positions.map((position) => (
          <ExperiencePositionItem key={position.id} position={position} />
        ))}
      </div>
    </Panel>
  )
}
