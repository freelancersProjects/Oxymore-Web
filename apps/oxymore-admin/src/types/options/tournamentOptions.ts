import {
  DropdownOption,
} from "../../components/Dropdown/Dropdown";

export const typeTournamentOptions: DropdownOption[] = [
  { value: "league", label: "League" },
  { value: "major", label: "Major" },
  { value: "minor", label: "Minor" },
  { value: "open", label: "Open" },
];

  export const formatTournamentOptions: DropdownOption[] = [
    { value: "BO1", label: "Best of 1" },
    { value: "BO3", label: "Best of 3" },
    { value: "BO5", label: "Best of 5" },
  ];

  export const structureTournamentOptions: DropdownOption[] = [
    { value: "single_elimination", label: "Single Elimination" },
    { value: "double_elimination", label: "Double Elimination" },
    { value: "group_single", label: "Group Stage + Single Elimination" },
    { value: "group_double", label: "Group Stage + Double Elimination" },
  ];
