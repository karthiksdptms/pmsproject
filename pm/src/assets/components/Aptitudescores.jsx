import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";


function Aptitudescores() {
    const [answers, setAnswers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchAnswers();
    }, []);

    const fetchAnswers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/answerkey/getscores");
            setAnswers(response.data);
        } catch (error) {
            console.error("Error fetching answers:", error);
        }
    };

    const totalRecords = answers.length;
    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    const handleRowsPerPageChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value > 0) {
            setRowsPerPage(value);
            setCurrentPage(1);
        }
    };

    const startIdx = (currentPage - 1) * rowsPerPage;
    const displayedData = answers.slice(startIdx, startIdx + rowsPerPage);

    const [selectedRows, setSelectedRows] = useState([]);

    const handleSelectRow = (regNumber) => {
        setSelectedRows((prev) =>
            prev.includes(regNumber) ? prev.filter((num) => num !== regNumber) : [...prev, regNumber]
        );
    };

    const handleSelectAll = () => {
        if (selectedRows.length === displayedData.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(displayedData.map((answer) => answer.registration_number));
        }
    };

    const handlePublish = async (answer) => {
        const resultData = {
            registration_number: answer.registration_number,
            batch: answer.batch,
            qpcode: answer.qpcode,
            title:answer.title,
            score: answer.score,
            totalscore: answer.totalscore,
        };

        try {
            const response = await axios.post("http://localhost:3000/api/student/publish-result", resultData);

            if (response.status === 200) {
                alert("Result has been posted to the student.");
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert("Result already published for this exam.");
            } else {
                alert("Could not publish result. Try again.");
            }
        }
    };

    const handlePublishSelected = async () => {
        if (selectedRows.length === 0) {
            alert("No students selected.");
            return;
        }
    
        const selectedResults = answers.filter(answer => selectedRows.includes(answer.registration_number))
            .map(answer => ({
                registration_number: answer.registration_number,
                batch: answer.batch,
                qpcode: answer.qpcode,
                title:answer.title,
                score: answer.score,
                totalscore: answer.totalscore,
            }));
    
        try {
            const response = await axios.post("http://localhost:3000/api/student/publish-multiple-results", {
                results: selectedResults,
            });
    
            if (response.status === 200) {
                alert("Selected results have been published successfully!");
                setSelectedRows([]); 
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                alert("Some results were already published.");
            } else {
                alert("Could not publish results. Try again.");
            }
        }
    };
    
    const handleDeleteSelected = async () => {
        if (selectedRows.length === 0) {
            alert("No students selected.");
            return;
        }
    
        const selectedResults = answers.filter(answer => selectedRows.includes(answer.registration_number))
            .map(answer => ({
                registration_number: answer.registration_number,
                qpcode: answer.qpcode,
            }));
    
        try {
            const response = await axios.post("http://localhost:3000/api/student/delete-multiple-results", {
                results: selectedResults,
            });
    
            if (response.status === 200) {
                alert("Selected records have been deleted successfully!");
                setAnswers(prev => prev.filter(answer => !selectedRows.includes(answer.registration_number))); 
                setSelectedRows([]); 
            }
        } catch (error) {
            alert("Could not delete records. Try again.");
        }
    };
    


    return (
        <>
            <Link to="/Maindashboard/Aptitude">
                <button
                    type="button"
                    className="btn btn-secondary"
                    style={{
                        marginLeft: "20px",
                        border: "none",
                        position: "relative",
                        top: "95px",
                        left: "210px",
                        fontSize: "35px",
                        color: "black",
                        backgroundColor: "transparent",
                        zIndex: "100",
                    }}
                >
                    <IoIosArrowBack />
                </button>
            </Link>
            <h2 style={{ position: "relative", left: "285px", top: "45px", width: "100px" }}>
                Scores
            </h2>
            <button
            style={{position:'relative',left:"1080px"}}
    className="btn btn-danger"
    onClick={handleDeleteSelected}
    disabled={selectedRows.length === 0} 
>
    Delete(selected)
</button>
            <button
            style={{position:'relative',left:"1100px"}}
    className="btn btn-success"
    onClick={handlePublishSelected}
    disabled={selectedRows.length === 0}
>
    Publish(selected)
</button>


            <div className="" style={{ position: "relative", left: '250px' }}>
                <div className="mt-4">
                    <h4 className="mb-4" style={{ position: "relative", top: "50px", left: "50px", width: '350px' }}>
                        Total Score Records:{" "}
                        <span style={{ backgroundColor: 'rgb(73, 73, 73)', padding: '2px 5px', borderRadius: '4px', color: "white" }}>
                            {totalRecords}
                        </span>
                    </h4>

                    <div className="flex justify-right items-center gap-4 mt-4"
                        style={{ position: "relative", left: "800px", bottom: "20px", width: '460px' }}>
                        <label>
                            No of records per page:
                            <input
                                type="number"
                                value={rowsPerPage}
                                onChange={handleRowsPerPageChange}
                                style={{ width: "50px", padding: "5px", marginLeft: "10px" }}
                            />
                        </label>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            className="btn"
                            disabled={currentPage === 1}
                        >
                            <i className="bi bi-chevron-double-left"></i>
                        </button>

                        <span className="text-lg">
                            Page {totalPages > 0 ? currentPage : 0} of {totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            className="btn"
                            disabled={currentPage >= totalPages}
                        >
                            <i className="bi bi-chevron-double-right arr"></i>
                        </button>
                    </div>

                    <div style={{
                        position: "relative",
                        top: "20px",
                        left: "-20px",
                        overflowY: "auto",
                        maxHeight: "800px",
                    }}>
                        <table className="table table-striped table-hover"
                            style={{
                                position: "relative",
                                left: "25px",
                                top: "20px",
                                marginBottom: '50px',
                                width: '100%',
                                minWidth: '650px'
                            }}>
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={selectedRows.length === displayedData.length && displayedData.length > 0}
                                        />
                                    </th>
                                    <th>Registration Number</th>
                                    <th>Batch</th>
                                    <th>Department</th>
                                    <th>QP Code</th>
                                    <th>Title</th>
                                    <th>Score</th>
                                    <th>Percentage</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedData.map((answer, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                onChange={() => handleSelectRow(answer.registration_number)}
                                                checked={selectedRows.includes(answer.registration_number)}
                                            />
                                        </td>
                                        <td>{answer.registration_number}</td>
                                        <td>{answer.batch}</td>
                                        
                                        <td>{answer.department}</td>
                                        <td>{answer.qpcode}</td>
                                        <td>{answer.title}</td>
                                        <td>{answer.score} / {answer.totalscore}</td>
                                        <td>
                                            {answer.totalscore > 0
                                                ? ((answer.score / answer.totalscore) * 100).toFixed(2) + "%"
                                                : "N/A"}
                                        </td>
                                        <td>
                                            <td>
                                                <button className="btn btn-primary" onClick={() => handlePublish(answer)}>
                                                    Publish
                                                </button>
                                            </td>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Aptitudescores;
