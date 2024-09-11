import { useState } from "react";
import "./App.css";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button, Popover } from "@mui/material";

function App() {
  const { data, isLoading } = useQuery({
    queryKey: ["data"],
    queryFn: () => {
      return axios
        .get("https://66dd75fcf7bcc0bbdcde2a03.mockapi.io/view")
        .then((res) => {
          return res.data;
        });
    },
  });
  const [nodes, setNodes] = useState([]);
  function setNode() {
    let newData = [];
    data[0].data.map((el) => {
      el.nodes.map((el1) => {
        newData.push(el1);
        el1.nodes.map((el2) => {
          newData.push(el2);
          el.nodes.map((el3) => {
            newData.push(el3);
          });
        });
      });
    });
    return newData;
  }
  console.log(data);
  // console.log(setNode());
  return (
    <>
      {!isLoading ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableCell>Area</TableCell>
              {data[0].headers.map((head) => {
                return <TableCell>{head}</TableCell>;
              })}
              <TableCell>Verdi</TableCell>
            </TableHead>
            <TableBody>
              {data[0].data.map((row) => {
                return (
                  <>
                    <TableRow
                      key={row.selectionId}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell rowSpan={row.nodes.length + 1}>
                        <div className="flex justify-between">
                          <h5>{row.name}</h5>
                          <MoreVertIcon />
                          <Popover
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                          >
                            <p>Test</p>
                          </Popover>
                        </div>
                        <div className="flex justify-between my-4">
                          <p>{row.distributionKey?.name}</p>
                          <div>
                            <CreateIcon />
                            <DeleteIcon />
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-1">
                            {row.distributionKey ? (
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            ) : (
                              ""
                            )}
                            <p>{row.distributionKey?.distributions[0]?.name}</p>
                          </div>
                          <div>
                            {row.distributionKey?.distributions[0]?.percentage}
                            {row.distributionKey ? "%" : ""}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                    {row?.nodes?.map((el) => {
                      return (
                        <>
                          <TableRow>
                            <TableCell>{el.value}</TableCell>
                            <TableCell>{el.secondColumn}</TableCell>
                            {el?.nodes?.map((el1, index) => {
                              console.log(
                                "index == ",
                                index,
                                "value == ",
                                el1.value
                              );
                              if (index !== 1) {
                                return (
                                  <>
                                    <TableCell>{el1.value}</TableCell>
                                    <TableCell>{el1.secondColumn}</TableCell>
                                    {el1.nodes.length !== 2 ? (
                                      el1.nodes.map((el2) => {
                                        return (
                                          <>
                                            <TableCell>{el2.value}</TableCell>
                                            {el2.nodes.length !== 2 ? (
                                              el2.nodes.map((el3) => {
                                                return (
                                                  <>
                                                    <TableCell>
                                                      {el3.value}
                                                    </TableCell>
                                                    <TableCell>
                                                      {el.calculatedValue}
                                                    </TableCell>
                                                  </>
                                                );
                                              })
                                            ) : (
                                              <>
                                                <TableCell></TableCell>
                                                <TableCell>
                                                  {el.calculatedValue}
                                                </TableCell>
                                              </>
                                            )}
                                          </>
                                        );
                                      })
                                    ) : (
                                      <TableCell></TableCell>
                                    )}
                                  </>
                                );
                              }
                            })}
                          </TableRow>
                        </>
                      );
                    })}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        ""
      )}
    </>
  );
}

export default App;
