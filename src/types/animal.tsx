// Animal interface
export interface Animal {
  Id: string;
  Name: string;
  Url: string;
}

// Animals List interface
export interface Animals {
  state: boolean;
  error?: boolean;
  results: Animal[];
  initial: Animal[];
}