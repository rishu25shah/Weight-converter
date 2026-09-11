weight=float(input("Enter the weight:"))
message=input("Is your given weight is in kilograms or pounds?(K/P)")
if message=="K":
    convert=weight*2.205
    print(f"Your weight in pound is:{round(convert,1)}LPS")
elif message=="p":
    convert=weight/2.205
    print(f"Your weight in kilogram is:{round(convert,1)}KG")
else:
    print("Invalid unit of mesurment")