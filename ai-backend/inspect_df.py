import pickle
import pandas as pd

try:
    with open("df.pkl", "rb") as f:
        df = pickle.load(f)
    print("COLUMNS:", df.columns.tolist())
    print("\nSAMPLE ROW:")
    print(df.iloc[0].to_dict())
except Exception as e:
    print("Error:", e)
