import { useState, useEffect } from 'react'
import './App.css'

// move btw here so both calculateTotals and App can use it
export const btw: any = {
  nl: 0.21,
  be: 0.21,
  de: 0.19,
  fr: 0.2,
  at: 0.2,
  ch: 0.081
}

export function calculateTotals(
  itemBedrag: number,
  itemAantal: number,
  land: keyof typeof btw,
  btwTable: typeof btw
) {
  const sumAantal = itemBedrag * itemAantal

  let korting = 0.03
  if (sumAantal > 5000) korting = 0.05
  if (sumAantal > 7000) korting = 0.07
  if (sumAantal > 10000) korting = 0.10
  if (sumAantal > 500000) korting = 0.15

  const kortingBedrag = sumAantal * korting
  const subtotaalNaKorting = sumAantal - kortingBedrag
  const btwBedrag = subtotaalNaKorting * btwTable[land]
  const finalAmount = subtotaalNaKorting + btwBedrag

  return {
    sumAantal,
    kortingProcent: korting,
    kortingBedrag,
    subtotaalNaKorting,
    btwBedrag,
    finalAmount
  }
}

function App() {
  const [itemBedrag, setitemBedrag] = useState(0)
  const [land, setLand] = useState<string>('nl')
  const [eindBedrag, setEindBedrag] = useState<number>(0)
  const [kortingProcent, setKortingProcent] = useState<number>(0)
  const [itemAantal, setItemAantal] = useState<number>(0)
  // NEW: popup visibility
  const [showRichPopup, setShowRichPopup] = useState(false)

  useEffect(() => {
    const result = calculateTotals(itemBedrag, itemAantal, land as any, btw)

    setKortingProcent(result.kortingProcent)
    setEindBedrag(result.finalAmount)

    if (result.finalAmount > 10000) {
      setShowRichPopup(true)
    }
  }, [itemBedrag, land, itemAantal])

  // purely visual: derive stack size from eindBedrag (1 note = 100 euro)
  const noteValue = 100
  const maxNotesToShow = 10
  const notesCount = Math.min(
    maxNotesToShow,
    Math.max(1, Math.floor(eindBedrag / noteValue))
  )

  // extra display values (no new logic)
  const sumAantal = itemBedrag * itemAantal
  const kortingBedrag = sumAantal * kortingProcent
  const subtotaalNaKorting = sumAantal - kortingBedrag
  const btwBedragDisplay = subtotaalNaKorting * btw[land]

  return (
    <div className="flex items-center justify-center bg-[#1f2933]">
      <div className="relative w-full max-w-5xl flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 via-white to-orange-200 overflow-hidden rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl py-10">
        {/* Dagobert Duck image in the corner */}
    

        <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl bg-white/90 shadow-xl rounded-2xl p-8 border border-orange-100 z-10">
          <h1 className="text-2xl flex justify-between md:text-3xl font-bold text-orange-600 mb-6 text-center">
            Oranje Olifant
              <div className="pointer-events">
        
        </div>
          </h1>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-center md:text-left">
                Voer item bedrag in
              </label>
              <input
                type="number"
                onChange={(e) => setitemBedrag(parseFloat(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                placeholder="Bijv. 100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-center md:text-left">
                Voer aantal items in
              </label>
              <input
                type="number"
                onChange={(e) => setItemAantal(parseInt(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                placeholder="Bijv. 5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-center md:text-left">
                Selecteer land
              </label>
              <select
                onChange={(e) => setLand(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                value={land}
              >
                <option value="nl">Nederland (nl)</option>
                <option value="be">België (be)</option>
                <option value="de">Duitsland (de)</option>
                <option value="fr">Frankrijk (fr)</option>
                <option value="at">Oostenrijk (at)</option>
                <option value="ch">Zwitserland (ch)</option>
              </select>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-100 space-y-1">
              <p className="text-sm text-gray-700 text-center md:text-left">
                Subtotaal (excl. btw):{' '}
                <span className="font-semibold text-gray-900">
                  € {sumAantal.toFixed(2)}
                </span>
              </p>
              <p className="text-sm text-gray-700 text-center md:text-left">
                Korting:{' '}
                <span className="font-semibold text-orange-600">
                  {(kortingProcent * 100).toFixed(2)}% (-€ {kortingBedrag.toFixed(2)})
                </span>
              </p>
              <p className="text-sm text-gray-700 text-center md:text-left">
                Subtotaal na korting (excl. btw):{' '}
                <span className="font-semibold text-gray-900">
                  € {subtotaalNaKorting.toFixed(2)}
                </span>
              </p>
              <p className="text-sm text-gray-700 text-center md:text-left">
                BTW bedrag:{' '}
                <span className="font-semibold text-emerald-700">
                  € {btwBedragDisplay.toFixed(2)}
                </span>
              </p>
              <p className="text-lg font-bold text-gray-800 text-center md:text-left">
                Totaal bedrag (incl. btw):{' '}
                <span className="text-orange-600">
                  € {eindBedrag.toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        </div>
    
       {eindBedrag > 1000 ? 
            <img
              src="https://artinsights.com/wp-content/uploads/2024/08/St.Laurent-Michelle-Scrooges-Happy-Place-16x12-TOC.jpg"
              alt="Dagobert Duck"
              className="w-72 h-72 md:w-80 md:h-80 object-contain drop-shadow-xl"
            /> :
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQUvKir7Znr7sUvGzxn7xQhhJChBpA4VFpOA&s"
              alt="Dagobert Duck"
              className="w-72 h-72 md:w-80 md:h-80 object-contain drop-shadow-xl"
            />
      }
        {/* Dynamic funny money stack at the bottom */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 flex justify-center mb-3">
          <div className="relative h-40 w-52 md:w-64">
            <div
              className="absolute -bottom-2 left-6 right-6 rounded-full bg-black/10 blur-md"
              style={{ height: 10 + notesCount * 0.4 }}
            />
            {Array.from({ length: notesCount }).map((_, i) => {
              const offset = i * 5
              const rotate = (i - notesCount / 2) * 1.4
              const isTop = i === notesCount - 1
              return (
                <div
                  key={i}
                  className={`absolute left-4 right-4 rounded-md border border-emerald-800 shadow-md ${
                    isTop
                      ? 'border-2 bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                  }`}
                  style={{
                    bottom: 10 + offset,
                    height: isTop ? 60 : 46,
                    transform: `rotate(${rotate}deg)`
                  }}
                >
                  {isTop && (
                    <div className="h-full flex items-center justify-between px-3">
                      <span className="text-xs font-semibold text-emerald-900">
                        Oranje
                        <br />
                        Bank
                      </span>
                      <span className="text-2xl font-black text-emerald-900 drop-shadow-sm">
                        100€
                      </span>
                      <span className="text-[10px] text-emerald-900 font-semibold">
                        OO
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
            <div className="absolute bottom-6 -right-1 flex gap-1">
              <div className="h-5 w-5 rounded-full bg-yellow-300 border border-yellow-500 shadow-sm" />
              <div className="h-4 w-4 rounded-full bg-yellow-200 border border-yellow-400 shadow-sm translate-y-1" />
            </div>
          </div>
        </div>

        {/* POPUP: Dagobert diving in money + money rain */}
        {showRichPopup && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60">
            {/* money rain */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="money-drop text-3xl md:text-4xl select-none"
                  style={{
                    left: `${(i * 3.3) % 100}%`,
                    animationDelay: `${i * 0.25}s`
                  }}
                >
                  💵
                </div>
              ))}
            </div>

            {/* popup card */}
            <div className="relative z-40 bg-white rounded-2xl shadow-2xl max-w-xl w-full mx-4 border-4 border-emerald-400 overflow-hidden">
              <button
                className="absolute top-2 right-2 z-50 rounded-full bg-black/70 text-white text-xs px-2 py-1 hover:bg-black cursor-pointer"
                onClick={() => setShowRichPopup(false)}
              >
                Sluiten
              </button>

              <div className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 px-4 pt-4 pb-2 text-center">
                <h2 className="text-xl md:text-2xl font-extrabold text-emerald-800 drop-shadow-sm">
                  Dagobert duikt in je geld!
                </h2>
                <p className="text-sm md:text-base text-emerald-900 mt-1">
                  Je totaal is hoger dan € 10.000 – tijd voor een goudbad.
                </p>
              </div>

              <div className="bg-black flex items-center justify-center">
                <img
                  src="https://i.redd.it/d0x99ghnplnd1.gif"
                  alt="Dagobert Duck diving in money"
                  className="max-h-80 w-full object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
