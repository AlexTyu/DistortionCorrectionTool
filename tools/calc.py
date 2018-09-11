
try:
    from sklearn import linear_model
except ImportError:
	print("failed to import sklearn, make sure sklearn is installed")


'''
From my current understanding:
Uses least squares to generate an equation to map the distorted image points to the original image points.

d(x,y) is distortion function.
Find the function d⁻¹(dx, dy) to map distorted points to non distorted space

d(x, y) => (dx, dy)
d⁻¹(dx, dy) => (x, y)

dₓ⁻¹(dx, dy) => x
dᵧ⁻¹(dx, dy) => y

Assuming d⁻¹(dx, dy) is some 2d polynomial β₀ + β₁x + β₂y + β₃x² + β₄xy + β₅y² + β₆x³ + ... + βₙxⁿyⁿ
Use least squares regression to find the coefficients [β₀,β₁,β₂,β₃,β₄,β₅,...,βₙ]

y = Xβ + ε
'''
class KuraDistortionCalculator:

    regX = linear_model.LinearRegression()
    regY = linear_model.LinearRegression()
    patterns = 6

    def __init__(self, *args, **kwargs):
        if "patterns" in kwargs:
            self.patterns = kwargs["patterns"]


    '''
    Return the x or y component of the trainout data, or the y in y = Xβ + ε

    trainOut = [[0,10], [1,11], [2,12], [3,13], [4,14], [5,15]]
    > getTrainOutComponent(0, trainOut) # for x
    [0, 1, 2, 3, 4, 5]
    > getTrainOutComponent(1, trainOut) # for y
    [10, 11, 12, 13, 14, 15]

    '''
    def getTrainOutComponent(self, i, trainOut):
        out = []
        for j in range(0, len(trainOut)):
            out.append(trainOut[j][i])
        return out

    '''
    Expands the data by the patterns

    > p = genPatterns(3)
    ['x', 'y', 'x * x', 'x * y', 'y * y', 'x * x * x', 'x * x * y', 'x * y * y', 'y * y * y']
    > expand([[1,1],[1,2],[1,3],[1,4],[1,5]], p)
    [[1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 2, 1, 2, 4, 1, 2, 4, 8], [1, 3, 1, 3, 9, 1, 3, 9, 27], [1, 4, 1, 4, 16, 1, 4, 16, 64], [1, 5, 1, 5, 25, 1, 5, 25, 125]]

    '''
    def expand(self, data, patterns):
        out = []
        for i in data:
            vals = []
            x = i[0]
            y = i[1]
            for pattern in patterns:
                vals.append(eval(pattern))
            out.append(vals)
        return out

    '''
    Format the regression coeficients to an equation, or the X in y = Xβ + ε

    > class fakeReg:
    >    intercept_=5
    >    coef_=[1,2,3,4,5,6,7,8,9]
    > componentGeneratingStr(genPatterns(3), fakeReg())
    '5 + x * 1 + y * 2 + x * x * 3 + x * y * 4 + y * y * 5 + x * x * x * 6 + x * x * y * 7 + x * y * y * 8 + y * y * y * 9'

    '''
    def componentGeneratingStr(self, patterns, reg):
        outStr = str(reg.intercept_)
        for i in range(0, len(reg.coef_)):
            outStr += ' + '
            outStr += patterns[i]
            outStr += ' * '
            outStr += str(reg.coef_[i])
        return outStr

    #trainIn = [[1, 1], [1, 0], [0, 1], [0, 0]]

    '''
    Generate list of polynomial equation components

    > genPatterns(3)
    ['x', 'y', 'x * x', 'x * y', 'y * y', 'x * x * x', 'x * x * y', 'x * y * y', 'y * y * y']

    '''
    def genPatterns(self, power):
        out = []
        for i in range(1, power + 1):
            for j in range(0, i + 1):
                elem = ''
                for k in range(0, i):
                    if j + k - i < 0:
                        elem += 'x'
                    else:
                        elem += 'y'
                    if k < i - 1:
                        elem += ' * '
                out.append(elem)
        return out

    '''
    Main calculation method.  Takes in trainIn, trainOut matrices and prints equations
    '''
    def calculate(self, trainIn, trainOut, patterns=None):

        if patterns is None:
            patterns = self.patterns

        patterns = self.genPatterns(patterns)
        #print(patterns)

        trainIn = self.expand(trainIn, patterns)
        trainOutX = self.getTrainOutComponent(0, trainOut)
        trainOutY = self.getTrainOutComponent(1, trainOut)

        if len(trainIn) != len(trainOutX) or len(trainIn) != len(trainOutY):
            print("\n\ndata size mismatch!\n\n")
            print("trainIn: " + str(len(trainIn)))
            print("trainOutX: " + str(len(trainOutX)))
            print("trainOutY: " + str(len(trainOutY)))

        # y = Xβ + ε
        self.regX.fit(trainIn, trainOutX)
        self.regY.fit(trainIn, trainOutY)

        outStr = ''
        outStr += 'o.x = '
        outStr += self.componentGeneratingStr(patterns, self.regX)
        outStr += ";"
        outStr += '\n\n'
        outStr += 'o.y = '
        outStr += self.componentGeneratingStr(patterns, self.regY)
        outStr += ";"
        outStr += '\n'

        print()
        print(outStr)

        return outStr


if __name__ == "__main__":
    import sys
    from importlib import import_module
    import os
    import argparse

    parser = argparse.ArgumentParser(description='Calculate distortion correction equation')
    parser.add_argument('file_name', metavar='FILE', type=str, nargs=1, help='File name of distortion data file')
    parser.add_argument('--patterns', default=6, type=int, help='The number of patterns to use in the equation')

    args = parser.parse_args()

    #dataFileName = os.path.splitext(sys.argv[1])[0]
    dataFileName = os.path.splitext(args.file_name[0])[0]

    data = import_module(dataFileName)

    data.setup()

    kdc = KuraDistortionCalculator(patterns=args.patterns)
    kdc.calculate(data.getTrainIn(), data.getTrainOut())
