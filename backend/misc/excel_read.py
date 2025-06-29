import numpy as np
import pandas as pd

def cleanFile(path):
    table = pd.read_excel(path)

    #Renames the columns to their respective names
    table.rename(columns={"First Year": "Course Code", "Unnamed: 1": "Course Name", "Unnamed: 2": "Hours-Lec",
                      "Unnamed: 3": "Hours-Lab", "Unnamed: 4": "Units-Lec", "Unnamed: 5": "Units-Lab", 
                      "Unnamed: 6": "Pre-requisite"}, inplace=True)
    
    #drop everything that's not needed
    table.dropna(subset=["Course Code"], inplace=True)
    table = table[(table["Course Code"] != "TOTAL") & 
              (table["Course Code"] != "TOTAL ACADEMIC UNIT(S):") & 
              (table["Course Code"] != "COURSE CODE")]
    
    #merge the lec and lab columns into one
    table["Hours"] = np.where(table["Hours-Lec"] > 0, table["Hours-Lec"], table["Hours-Lab"])
    table["Units"] = np.where(table["Units-Lec"] > 0, table["Units-Lec"], table["Units-Lab"])

    #drop the lec & lab columns
    table.drop(columns=["Units-Lec", "Units-Lab", "Hours-Lec", "Hours-Lab"], inplace=True)

    #add the year column
    table["Year"] = table["Course Code"].where(table["Course Code"].str.contains("Year"))
    table["Year"].ffill(inplace=True)
    table = table[~(table["Course Code"].str.contains("Year"))].reset_index(drop=True)

    #add the semester column
    table["Semester"] = table["Course Code"].where(table["Course Code"].str.contains("Semester"))
    table["Semester"].ffill(inplace=True)
    table = table[~(table["Course Code"].str.contains("Semester"))].reset_index(drop=True)

    #change the values of the year and sem to numbers
    table.replace(["First Semester", "Second Semester", "First Year", "Second Year", "Third Year", "Fourth Year"], [1, 2, 1, 2, 3, 4], inplace=True)

    return table


