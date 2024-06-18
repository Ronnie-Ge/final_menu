import numpy as np

class select:
    def __init__(self,x,y,num):
        self.x = x
        self.y = y
        self.num = num
        self.dict = {"x":x,"y":y,"num":num}

class BOX:
    def __init__(self,box):
        self.x = np.mean([cor[0] for cor in box] )
        self.y = np.mean([cor[1] for cor in box] )
        self.x_min = 0.5*(box[0][0]+box[3][0])
        self.x_max = 0.5*(box[1][0]+box[2][0])
        self.y_min = 0.5*(box[0][1]+box[1][1])
        self.y_max = 0.5*(box[2][1]+box[3][1])

def create_dict(data):
    dict = {'name':data[0],'price':data[1]}
    return dict