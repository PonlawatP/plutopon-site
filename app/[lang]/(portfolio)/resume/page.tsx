"use client"
import { experience_data, education_data } from "@/lib/globalvariant";

export default function ResumePage() {

  return (<>
      {/* experience section */}
      {experience_data.length > 0 && (
        <div className="pt-6 space-y-4 max-lg:mx-8">
          <h2 className="text-2xl font-bold animate-split-down">Experience</h2>
          {/* showcase content */}
          <div className="grid gap-4 max-lg:gap-14">
            {experience_data.map((item, index) => {
              const header = () => (
                <div className="timeline-header mb-4">
                  <h3>{item.date}</h3>
                  <h4 className="text-base text-gray-400">{item.experience_type}</h4>
                </div>
              )

              return (
              <div key={index} className="grid lg:grid-cols-[1fr_2fr] gap-4 animate-split-down">
                <div className="max-lg:hidden">{header()}</div>
                <div className="timeline-content">
                  <div className="flex max-md:flex-wrap md:justify-between items-center max-lg:mb-4">
                    <h3 className="font-bold">{item.title}</h3>
                    {item.company && <>
                      <h3 className="md:hidden font-base mx-2">at</h3>
                      <div className="relative">
                        <h3 className="max-md:hidden text-base absolute -top-3 -left-3 text-gray-300">at</h3>
                        <h3 className="font-bold">{item.company}</h3>
                      </div>
                    </>}
                  </div>
                  <div className="lg:hidden">{header()}</div>
                  <ul className="list-disc text-base text-gray-400">
                    {item.description.map((line, indexLine) => (
                      <li key={indexLine}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      )}

      {/* education section */}
      {education_data.length > 0 && (
        <div className="pt-6 space-y-4 max-lg:mx-8">
          <h2 className="text-2xl font-bold animate-split-down">Education</h2>
          {/* showcase content */}
          <div className="grid gap-4">
          {education_data.map((item, index) => (
            <div key={index} className="cursor-target animate-split-down">
              <div className="max-md:flex-col-reverse flex md:justify-between md:items-center">
                <h3 className="text-xl font-medium">{item.title}</h3>
                <h3 className="text-xl font-medium max-md:font-bold">{item.institution}</h3>
              </div>
              <div className="max-md:flex-col-reverseflex justify-between items-center">
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
