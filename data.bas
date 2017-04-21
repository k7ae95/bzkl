Attribute VB_Name = "Export"
Const dQuotes = """"

Function QuotesWrap(value As String) As String
    QuotesWrap = dQuotes + value + dQuotes
End Function

Function JSON(key As String, value As String) As String
    JSON = "{" + QuotesWrap(key) + ": " + QuotesWrap(value) + "}"
End Function

Function DivTag(content As String, classes As String) As String
    content = Replace(content, dQuotes, "\" + dQuotes)

    DivTag = "<div class=\" + dQuotes + classes + "\" + dQuotes + ">" + content + "</div>"
End Function

Function SaveToTextFile(fileName As String, data As String) As Integer
    Set fsT = CreateObject("ADODB.Stream")
    fsT.Type = 2
    fsT.Charset = "utf-8"
    fsT.Open

    fsT.WriteText data
    fsT.SaveToFile fileName, 2

    Set fsT = Nothing
    
    SaveToTextFile = 0
End Function

Sub Export()
    Dim fs As Object
    Dim fileName As String
    Dim fileData As String
    Dim level As Long
    
    Set fs = CreateObject("Scripting.FileSystemObject")
    fileName = ActiveWorkbook.Path + "\js\" & fs.GetBaseName(ActiveWorkbook.FullName) + ".js"
    level = 0
    
    Debug.Print ActiveWorkbook.FullName
    Debug.Print fileName

    fileData = "var " + fs.GetBaseName(ActiveWorkbook.FullName) + " = {" + vbCrLf
    
    Dim sheetCount As Long
    sheetCount = ActiveWorkbook.Worksheets.Count - 1
    
    level = level + 1
    Dim i As Long
    For i = 1 To sheetCount
        Dim table As ListObject
        Dim rowHeader As Range
        Dim rowCount As Long
        Dim columnCount As Long
        
        Set table = ActiveWorkbook.Sheets(i).ListObjects(1)
        Set rowHeader = table.HeaderRowRange
        rowCount = table.Range.Rows.Count
        columnCount = table.Range.Columns.Count
        
        fileData = fileData + WorksheetFunction.Rept(vbTab, level) + dQuotes + ActiveWorkbook.Sheets(i).Name + dQuotes + ": {" + vbCrLf
        
        level = level + 1
        Dim j As Long
        For j = 2 To rowCount
            Dim currentRow As Range
            
            Set currentRow = table.Range.Cells(j, 1).Rows
            
            fileData = fileData + WorksheetFunction.Rept(vbTab, level) + dQuotes + currentRow.Cells(1, 1) + dQuotes + ": {" + vbCrLf
            
            level = level + 1
            Dim k As Long
            Dim check As Boolean
            Dim value As String
            Dim nextValue As String
            
            check = False
            
            For k = 1 To columnCount
                Dim header As String
                
                header = rowHeader.Cells(1, k)
                
                value = currentRow.Cells(1, k)
                nextValue = currentRow.Cells(1, k + 1)
                value = Replace(value, dQuotes, "\\" + dQuotes)

                If value <> "" Then
                    value = DivTag( _
                        value, _
                        header _
                        )
                        
                    If check Then
                        fileData = fileData + "," + vbCrLf
                    End If
                    
                    check = True
                    
                    fileData = fileData + WorksheetFunction.Rept(vbTab, level) + dQuotes + header + dQuotes + ": "
                    fileData = fileData + QuotesWrap(value)
                End If
            Next k
            level = level - 1
            
            fileData = fileData + vbCrLf + WorksheetFunction.Rept(vbTab, level) + "}"
            
            If j < rowCount Then
                fileData = fileData + "," + vbCrLf
            End If
        Next j
        level = level - 1
        
        fileData = fileData + vbCrLf + WorksheetFunction.Rept(vbTab, level) + "}"
        
        If i < sheetCount Then
            fileData = fileData + "," + vbCrLf
        End If
    Next i
    level = level - 1

    fileData = fileData + vbCrLf + "};"
    
    Dim temp As Integer
    temp = SaveToTextFile(fileName, fileData)
    
    'MsgBox "Finished"
End Sub

