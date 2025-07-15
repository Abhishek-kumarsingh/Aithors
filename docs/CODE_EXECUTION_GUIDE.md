# Code Execution System Guide

## 🎯 Overview

The InterviewAI platform includes a comprehensive code execution system that supports multiple programming languages with proper input/output handling. This guide explains how to write code that works correctly with our web-based execution environment.

## 🔧 **Fixed C++ Input Issue**

### **Problem Solved:**
The original C++ code wasn't working because:
1. Web-based execution environments don't support real-time interactive input (`cin`)
2. The program needed to read from the input panel in our 80/20 split-screen layout
3. The execution system wasn't properly simulating input handling

### **Solution Implemented:**
1. **Enhanced Code Execution API**: Updated `/api/code-execution/run` to properly handle input for all languages
2. **Input Panel Integration**: The right side input panel now feeds data to the code execution
3. **Improved C++ Simulation**: Better parsing and execution of C++ programs with input

## 📝 **How to Use Input in Different Languages**

### **C++ - Fixed Example**
```cpp
#include <iostream>
using namespace std;

int main() {
    int num1, num2;
    
    cout << "Enter two numbers (space-separated in input panel):" << endl;
    
    // Read two integers from input panel
    if (cin >> num1 >> num2) {
        cout << "First number: " << num1 << endl;
        cout << "Second number: " << num2 << endl;
        cout << "Sum: " << (num1 + num2) << endl;
    } else {
        cout << "Error: Please provide two valid numbers in the input panel" << endl;
        cout << "Example input: 5 10" << endl;
    }
    
    return 0;
}
```

**Input Panel:** `5 10`
**Output:**
```
Enter two numbers (space-separated in input panel):
First number: 5
Second number: 10
Sum: 15
```

### **Python - Input Handling**
```python
print("Enter two numbers (space-separated in input panel):")

try:
    numbers = input().split()  # Reads from input panel
    num1 = int(numbers[0])
    num2 = int(numbers[1])
    
    print(f"First number: {num1}")
    print(f"Second number: {num2}")
    print(f"Sum: {num1 + num2}")
    
except (ValueError, IndexError):
    print("Please provide two valid numbers in the input panel")
    print("Example: 5 10")
```

### **Java - Scanner Input**
```java
import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        System.out.println("Enter two numbers (space-separated in input panel):");
        
        Scanner scanner = new Scanner(System.in);
        
        try {
            int num1 = scanner.nextInt();
            int num2 = scanner.nextInt();
            
            System.out.println("First number: " + num1);
            System.out.println("Second number: " + num2);
            System.out.println("Sum: " + (num1 + num2));
            
        } catch (Exception e) {
            System.out.println("Please provide two valid numbers in the input panel");
        }
        
        scanner.close();
    }
}
```

### **JavaScript - Input Simulation**
```javascript
// For web execution, input values are provided via the input panel
console.log("Enter two numbers (space-separated in input panel):");

const input = "5 10"; // This gets replaced with actual input
const numbers = input.trim().split(' ');
const num1 = parseInt(numbers[0]) || 0;
const num2 = parseInt(numbers[1]) || 0;

console.log(`First number: ${num1}`);
console.log(`Second number: ${num2}`);
console.log(`Sum: ${num1 + num2}`);
```

## 🎨 **80/20 Split-Screen Layout**

### **Layout Structure:**
- **Left Side (80%)**: Monaco code editor with full IDE features
- **Right Side (20%)**: Problem statement and input panel

### **Input Panel Features:**
- **Multi-line Support**: Enter multiple values on separate lines
- **Space-separated Values**: Enter multiple values separated by spaces
- **Real-time Execution**: Input is passed to your code when you click "Run Code"

### **Input Guidelines:**
1. **Single Value**: Just type the value (e.g., `42`)
2. **Multiple Values**: Space-separated (e.g., `5 10 15`)
3. **Multiple Lines**: Each line is a separate input (useful for complex programs)

## 🔧 **Code Execution API**

### **Enhanced Features:**
- **Input Handling**: Proper simulation of `cin`, `input()`, `Scanner`, etc.
- **Error Handling**: Clear error messages for invalid input
- **Multi-language Support**: JavaScript, Python, Java, C++, Go, Rust
- **Performance Metrics**: Execution time and memory usage tracking

### **API Endpoint:**
```typescript
POST /api/code-execution/run
{
  "code": "your_code_here",
  "language": "cpp",
  "input": "5 10"
}
```

### **Response:**
```json
{
  "output": "First number: 5\nSecond number: 10\nSum: 15",
  "executionTime": 45,
  "memoryUsed": 1024000,
  "exitCode": 0
}
```

## 📚 **Code Templates**

The code environment now includes enhanced templates for all languages that demonstrate proper input handling:

### **Template Features:**
- **Input Examples**: Show how to read from the input panel
- **Error Handling**: Graceful handling of invalid input
- **Clear Instructions**: Comments explaining how to use the input panel
- **Best Practices**: Follow language-specific conventions

## 🚀 **Best Practices**

### **For C++ Programs:**
1. **Always check input validity**: Use `if (cin >> var)` to verify input
2. **Provide clear prompts**: Tell users what input format to use
3. **Handle edge cases**: Check for invalid or missing input
4. **Use appropriate data types**: Match your variables to expected input

### **For All Languages:**
1. **Test with sample input**: Use the input panel to test your code
2. **Provide example input**: Show users what format to use
3. **Handle errors gracefully**: Don't crash on invalid input
4. **Clear output formatting**: Make results easy to understand

## 🧪 **Testing Your Code**

### **Step-by-Step Testing:**
1. **Write your code** in the left panel (80% width)
2. **Enter test input** in the input panel (right side, 20% width)
3. **Click "Run Code"** to execute
4. **Check output** in the output section
5. **Modify input** to test different scenarios

### **Common Input Formats:**
- **Two integers**: `5 10`
- **Array of numbers**: `1 2 3 4 5`
- **String input**: `Hello World`
- **Multiple lines**:
  ```
  5
  10
  ```

## 🔍 **Troubleshooting**

### **Common Issues:**

#### **"No output" or "Program executed successfully"**
- **Cause**: No `cout`, `print()`, or output statements
- **Solution**: Add output statements to see results

#### **"Error: Please provide input values"**
- **Cause**: Program expects input but input panel is empty
- **Solution**: Add values to the input panel

#### **"Invalid input format"**
- **Cause**: Input doesn't match expected format
- **Solution**: Check input format (space-separated, correct data types)

#### **Code doesn't compile/run**
- **Cause**: Syntax errors or unsupported features
- **Solution**: Check syntax, use supported language features

### **Getting Help:**
1. **Check the input guidelines** in the question panel
2. **Use the provided templates** as starting points
3. **Test with simple input** first
4. **Review error messages** for specific issues

## 🎯 **Success Metrics**

The enhanced code execution system now provides:
- ✅ **Proper Input Handling**: All languages support input from the input panel
- ✅ **Clear Error Messages**: Helpful feedback for debugging
- ✅ **Realistic Simulation**: Mimics real programming environments
- ✅ **Multi-language Support**: Consistent experience across languages
- ✅ **Professional UI**: 80/20 split layout with clear instructions

## 🚀 **Future Enhancements**

### **Planned Features:**
- **Real Code Execution**: Integration with Docker containers for actual compilation
- **Advanced Input**: File input, command-line arguments
- **Debugging Support**: Step-through debugging capabilities
- **Performance Analysis**: Detailed memory and time profiling
- **Test Case Integration**: Automated testing with multiple test cases

---

**The code execution system now properly handles interactive input and provides a professional coding experience!** 🎉
