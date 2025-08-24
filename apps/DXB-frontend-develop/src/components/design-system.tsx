"use client"

import { useState, useRef, useEffect } from "react"

// --- Иконки ---
const SearchIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const ChevronDownIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

const CheckIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-4 w-4 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const StarIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-4 w-4 mr-2 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
)

// Новые иконки
const BuildingIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
)
const PieChartIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
)
const ReportIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)
const UserIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)
const SettingsIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const LocationPinIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const HeartIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 20.036l-7.682-7.682a4.5 4.5 0 010-6.364z"
    />
  </svg>
)
const FilterIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
)

// --- Компоненты выпадающего меню ---
// ... (код без изменений)
const DropdownMenuItem = ({ children, isSelected, onSelect }) => {
  const baseClasses = "px-4 py-2 text-sm text-gray-700 cursor-pointer transition-colors duration-150"
  const selectedClasses = "bg-indigo-100 text-indigo-700 font-semibold"
  const hoverClasses = "hover:bg-gray-100"
  return (
    <div className={`${baseClasses} ${isSelected ? selectedClasses : hoverClasses}`} onClick={onSelect}>
      {children}
    </div>
  )
}
const DropdownMenu = ({ options, selectedOption, onSelect, closeMenu }) => {
  const menuRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) closeMenu()
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [closeMenu])
  return (
    <div ref={menuRef} className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="py-1">
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            isSelected={selectedOption === option}
            onSelect={() => {
              onSelect(option)
              closeMenu()
            }}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </div>
    </div>
  )
}

// --- Компонент поля ввода (Dropdown) ---
// ... (код без изменений)
const CustomInput = ({
  state = "default",
  label = "LABEL",
  placeholder = "Placeholder",
  caption = "Caption",
  options = [],
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState("")
  const baseInputContainerStyles =
    "relative flex items-center w-full bg-gray-50 border-2 rounded-lg px-3 py-2 transition-all duration-200 cursor-pointer"
  const stateStyles = {
    default: "border-gray-200",
    hover: "border-gray-400",
    filled: "border-blue-500 bg-blue-50",
    active: "border-blue-500 ring-2 ring-blue-300",
    error: "border-red-500 bg-red-50",
    disabled: "border-gray-200 bg-gray-100 cursor-not-allowed",
    selected: "border-blue-500 bg-blue-50",
  }
  const iconStyles = {
    default: "text-gray-400",
    hover: "text-gray-600",
    filled: "text-blue-600",
    active: "text-blue-600",
    error: "text-red-600",
    disabled: "text-gray-300",
    selected: "text-blue-600",
  }
  const captionStyles = {
    default: "text-gray-500",
    hover: "text-gray-600",
    filled: "text-gray-500",
    active: "text-gray-500",
    error: "text-red-600",
    disabled: "text-gray-400",
    selected: "text-gray-500",
  }
  const currentVisualState = isOpen ? "active" : state === "hover" ? (isHovered ? "hover" : "default") : state
  const inputContainerClasses = `${baseInputContainerStyles} ${stateStyles[currentVisualState]}`
  const currentIconClass = iconStyles[currentVisualState]
  const currentCaptionClass = captionStyles[currentVisualState]
  const handleToggle = () => {
    if (state !== "disabled") setIsOpen(!isOpen)
  }
  return (
    <div
      className="font-sans w-full"
      onMouseEnter={() => state === "hover" && setIsHovered(true)}
      onMouseLeave={() => state === "hover" && setIsHovered(false)}
    >
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <div className={inputContainerClasses} onClick={handleToggle}>
          <SearchIcon className={currentIconClass} />
          <span className={`ml-2 flex-grow ${state === "disabled" ? "text-gray-400" : "text-gray-800"}`}>
            {selectedValue || placeholder}
          </span>
          <ChevronDownIcon
            className={`${currentIconClass} ${isOpen ? "transform rotate-180" : ""} transition-transform`}
          />
        </div>
        {isOpen && options.length > 0 && (
          <DropdownMenu
            options={options}
            selectedOption={selectedValue}
            onSelect={setSelectedValue}
            closeMenu={() => setIsOpen(false)}
          />
        )}
      </div>
      <p className={`text-xs mt-1 ${currentCaptionClass}`}>{caption}</p>
    </div>
  )
}

// --- Компоненты вкладок (Tabs) ---
// ... (код без изменений)
const SegmentedControl = ({ tabs, activeTab, setActiveTab }) => (
  <div>
    <label className="text-xs font-bold text-gray-400 mb-2 block">LABEL</label>
    <div className="bg-gray-100 rounded-lg p-1 flex items-center">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 text-center px-4 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${activeTab === tab ? "bg-white shadow text-gray-800" : "text-gray-500 hover:bg-gray-200"}`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
)
const Tab = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${isActive ? "bg-white text-blue-600 border border-blue-500" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
  >
    {label}
  </button>
)

// --- Компонент чекбокса (Checkbox) ---
// ... (код без изменений)
const Checkbox = ({ label, checked, onChange, disabled = false }) => (
  <label className={`flex items-center cursor-pointer ${disabled ? "cursor-not-allowed" : ""}`}>
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${checked ? (disabled ? "bg-blue-300 border-blue-300" : "bg-blue-600 border-blue-600") : disabled ? "bg-gray-200 border-gray-200" : "bg-white border-gray-300"}`}
    >
      {checked && <CheckIcon className="text-white" />}
    </div>
    {label && <span className={`ml-2 text-sm ${disabled ? "text-gray-400" : "text-gray-700"}`}>{label}</span>}
  </label>
)

// --- Компоненты хедера (Header) ---
// ... (код без изменений)
const NavItem = ({ children }) => (
  <a href="#" className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2 rounded-md text-sm transition-colors">
    {children}
  </a>
)
const Header = () => (
  <header className="bg-white rounded-full shadow-md w-full max-w-5xl mx-auto">
    <nav className="flex items-center justify-between p-2">
      <div className="flex items-center space-x-2">
        <div className="font-bold text-lg px-3">LOGO</div>
        <NavItem>Main</NavItem>
        <NavItem>Analytics</NavItem>
        <NavItem>Reports</NavItem>
        <NavItem>Payments</NavItem>
      </div>
      <div>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-full text-sm transition-colors">
          Sign in
        </button>
      </div>
    </nav>
  </header>
)

// --- Демонстрационный компонент ---
export default function App() {
  const [activeSegment, setActiveSegment] = useState("Label 1")
  const [activeTab, setActiveTab] = useState("Item 2")
  const [isChecked, setIsChecked] = useState(true)
  const [isDisabledChecked, setIsDisabledChecked] = useState(true)

  const segmentTabs = ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"]
  const regularTabs = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]
  const dropdownOptions = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]

  const icons = [
    { Component: BuildingIcon, name: "Building" },
    { Component: PieChartIcon, name: "PieChart" },
    { Component: ReportIcon, name: "Report" },
    { Component: UserIcon, name: "User" },
    { Component: SettingsIcon, name: "Settings" },
    { Component: LocationPinIcon, name: "Location" },
    { Component: HeartIcon, name: "Heart" },
    { Component: FilterIcon, name: "Filter" },
  ]

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <Header />
      <div className="w-full max-w-5xl mx-auto space-y-8 mt-8">
        {/* Новая секция с иконками */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Iconography</h1>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 text-gray-600">
            {icons.map(({ Component, name }) => (
              <div
                key={name}
                className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Component className="h-8 w-8" />
                <p className="text-xs mt-2">{name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Interactive Dropdown</h1>
          <div className="max-w-xs mx-auto">
            <CustomInput
              label="SELECT ITEM"
              placeholder="Choose an item"
              caption="This is an interactive dropdown"
              options={dropdownOptions}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h1 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Tabs</h1>
            <div className="space-y-8">
              <SegmentedControl tabs={segmentTabs} activeTab={activeSegment} setActiveTab={setActiveSegment} />
              <div className="flex items-center gap-2 flex-wrap">
                {regularTabs.map((tab) => (
                  <Tab key={tab} label={tab} isActive={activeTab === tab} onClick={() => setActiveTab(tab)} />
                ))}
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Controls</h1>
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-400">DEFAULT</p>
              <div className="flex items-center gap-6">
                <Checkbox checked={false} onChange={() => {}} />
                <Checkbox checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
              </div>
              <p className="text-xs font-bold text-gray-400 mt-4">DISABLED</p>
              <div className="flex items-center gap-6">
                <Checkbox checked={false} disabled />
                <Checkbox
                  checked={isDisabledChecked}
                  onChange={() => setIsDisabledChecked(!isDisabledChecked)}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
