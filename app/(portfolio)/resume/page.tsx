"use client"
import { experience_data, education_data } from "@/lib/globalvariant";

export default function ResumePage() {

  return (<>
      {/* experience section */}
      {experience_data.length > 0 && (
        <div className="pt-6 space-y-4">
          <h2 className="text-2xl font-bold">Experience</h2>
          {/* showcase content */}
          <div className="grid gap-4">
            {experience_data.map((item, index) => (
              <div key={index} className="grid grid-cols-[1fr_2fr] gap-4">
                <div className="timeline-header">
                  <h3>{item.date}</h3>
                  <h4 className="text-base text-gray-300">{item.experience_type}</h4>
                </div>
                <div className="timeline-content">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">{item.title}</h3>
                    {item.company && <div className="relative">
                      <h3 className="text-base absolute -top-3 -left-3 text-gray-300 left-0">at</h3>
                      <h3 className="font-bold">{item.company}</h3>
                    </div>}
                  </div>
                  <ul className="list-disc text-base">
                    {item.description.map((line, indexLine) => (
                      <li key={indexLine}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
              ))}
          </div>
        </div>
      )}

      {/* education section */}
      {education_data.length > 0 && (
        <div className="pt-6 space-y-4">
          <h2 className="text-2xl font-bold">Education</h2>
          {/* showcase content */}
          <div className="grid gap-4">
          {education_data.map((item, index) => (
            <div key={index} className="cursor-target">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium">{item.title}</h3>
                <h3 className="text-xl font-medium">{item.institution}</h3>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-300">{item.year}</p>
              </div>
              {item.description && (
                <p className="text-gray-300 mt-2">
                  {item.description}
                </p>
              )}
            </div>
          ))}
          </div>
        </div>
      )}
    </>
  );
}
