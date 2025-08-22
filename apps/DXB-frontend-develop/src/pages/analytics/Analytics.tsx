import React, { useState } from "react";
import { Card, Table, Collapse, Segmented, DatePicker, Progress, Statistic, Row, Col, Tag, Space, Tooltip } from "antd";
import CustomButton from "@/components/CustomButton/CustomButton";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import CustomTabs from "@/components/CustomTabs/CustomTabs";
import CustomInput from "@/components/CustomInput/CustomInput";
import { SearchOutlined, FilterOutlined, DownloadOutlined, EyeOutlined, BarChartOutlined, LineChartOutlined, PieChartOutlined } from "@ant-design/icons";
import styles from "./Analytics.module.scss";

// replaced Select with CustomSelect; Option not used
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

const Analytics: React.FC = () => {
    const [selectedArea, setSelectedArea] = useState<string>("all");
    const [selectedProject, setSelectedProject] = useState<string>("all");
    const [selectedBuilding, setSelectedBuilding] = useState<string>("all");
    const [dateRange, setDateRange] = useState<any>(null);
    const [searchText, setSearchText] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("overview");

    // Моковые данные для таблицы
    const tableData = [
        {
            key: "1",
            area: "Downtown Dubai",
            project: "Burj Khalifa",
            building: "Tower A",
            price: "$2,500/m²",
            deals: 45,
            volume: "$12.5M",
            status: "active",
            trend: "up",
        },
        {
            key: "2",
            area: "Palm Jumeirah",
            project: "Palm Tower",
            building: "Tower B",
            price: "$3,200/m²",
            deals: 32,
            volume: "$8.9M",
            status: "pending",
            trend: "stable",
        },
        {
            key: "3",
            area: "Dubai Marina",
            project: "Marina Heights",
            building: "Tower C",
            price: "$2,800/m²",
            deals: 67,
            volume: "$18.7M",
            status: "active",
            trend: "up",
        },
    ];

    const columns = [
        {
            title: "Area",
            dataIndex: "area",
            key: "area",
            render: (text: string) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: "Project",
            dataIndex: "project",
            key: "project",
        },
        {
            title: "Building",
            dataIndex: "building",
            key: "building",
        },
        {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (text: string) => <span className={styles.priceCell}>{text}</span>,
        },
        {
            title: "Deals",
            dataIndex: "deals",
            key: "deals",
            render: (deals: number) => (
                <Space>
                    <span>{deals}</span>
                    <Progress percent={deals} size="small" showInfo={false} />
                </Space>
            ),
        },
        {
            title: "Volume",
            dataIndex: "volume",
            key: "volume",
            render: (text: string) => <span style={{ fontWeight: "bold", color: "#52c41a" }}>{text}</span>,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => (
                <Tag color={status === "active" ? "green" : "orange"}>
                    {status === "active" ? "Active" : "Pending"}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: () => (
                <Space>
                    <Tooltip title="View Details">
                        <CustomButton variant="link" icon={<EyeOutlined />} size="small" />
                    </Tooltip>
                    <Tooltip title="Download Report">
                        <CustomButton variant="link" icon={<DownloadOutlined />} size="small" />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const handleFilterApply = () => {
        console.log("Filters applied:", { selectedArea, selectedProject, selectedBuilding, dateRange, searchText });
    };

    const handleExportData = () => {
        console.log("Exporting data...");
    };

    return (
        <div className={styles.analyticsContainer}>
            <div className={styles.headerBar}>
                <div>
                    <h1>📊 Analytics Dashboard</h1>
                    <p>Comprehensive real estate market analysis for Dubai</p>
                </div>
                <Space>
                    <CustomButton icon={<DownloadOutlined />} onClick={handleExportData}>
                        Export Data
                    </CustomButton>
                    <CustomButton type="primary" icon={<BarChartOutlined />}>
                        Generate Report
                    </CustomButton>
                </Space>
            </div>

            {/* Advanced Filters Section */}
            <Card title={<><FilterOutlined /> Advanced Filters</>} className={styles.filtersCard}>
                <Row gutter={[16, 16]} align="middle">
                    <Col span={6}>
                        <Segmented
                            className={styles.segmented}
                            options={[
                                { label: "All Areas", value: "all" },
                                { label: "Downtown", value: "downtown" },
                                { label: "Marina", value: "marina" },
                                { label: "Palm", value: "palm" },
                            ]}
                            value={selectedArea}
                            onChange={(value) => setSelectedArea(value as string)}
                        />
                    </Col>
                    <Col span={6}>
                        <CustomSelect
                            className={styles.select}
                            placeholder="Select Project"
                            value={selectedProject}
                            onChange={setSelectedProject}
                            showSearch
                            options={[
                                { value: "all", label: "All Projects" },
                                { value: "burj", label: "Burj Khalifa" },
                                { value: "palm", label: "Palm Tower" },
                                { value: "marina", label: "Marina Heights" },
                            ]}
                        />
                    </Col>
                    <Col span={6}>
                        <CustomSelect
                            className={styles.select}
                            placeholder="Select Building"
                            value={selectedBuilding}
                            onChange={setSelectedBuilding}
                            showSearch
                            options={[
                                { value: "all", label: "All Buildings" },
                                { value: "tower-a", label: "Tower A" },
                                { value: "tower-b", label: "Tower B" },
                                { value: "tower-c", label: "Tower C" },
                            ]}
                        />
                    </Col>
                    <Col span={6}>
                        <RangePicker
                            value={dateRange}
                            onChange={setDateRange}
                            className={styles.rangePicker}
                            placeholder={["Start Date", "End Date"]}
                        />
                    </Col>
                </Row>
                <Row gutter={[16, 16]} className={styles.filtersFooter}>
                    <Col span={12}>
                        <CustomInput
                            placeholder="Search properties, projects, or areas..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col span={12}>
                        <Space>
                            <CustomButton type="primary" onClick={handleFilterApply}>
                                Apply Filters
                            </CustomButton>
                            <CustomButton onClick={() => {
                                setSelectedArea("all");
                                setSelectedProject("all");
                                setSelectedBuilding("all");
                                setDateRange(null);
                                setSearchText("");
                            }}>
                                Clear All
                            </CustomButton>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Tabs for different views */}
            <CustomTabs 
                activeKey={activeTab} 
                onChange={setActiveTab} 
                className={styles.tabs}
                items={[
                    {
                        key: "overview",
                        label: <span><BarChartOutlined />Overview</span>,
                        children: (
                            /* Market Overview Cards */
                            <Row gutter={[16, 16]} className={styles.cardsRow}>
                                <Col span={6}>
                                    <Card className={styles.card}>
                                        <Statistic
                                            title="Total Properties"
                                            value={15432}
                                            className={styles.valueBlue}
                                            suffix={<span className={styles.suffixUpGreen}>↑ +12.5%</span>}
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card className={styles.card}>
                                        <Statistic
                                            title="Average Price"
                                            value={2850}
                                            precision={0}
                                            className={styles.valueBlue}
                                            prefix="$"
                                            suffix="/m² ↑ +8.3%"
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card className={styles.card}>
                                        <Statistic
                                            title="Total Deals"
                                            value={2156}
                                            className={styles.valueBlue}
                                            suffix={<span className={styles.suffixUpGreen}>↑ +18.5%</span>}
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card className={styles.card}>
                                        <Statistic
                                            title="Market Volume"
                                            value={82.5}
                                            precision={1}
                                            className={styles.valueBlue}
                                            prefix="$"
                                            suffix="M ↑ +20.7%"
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        )
                    },
                    {
                        key: "transactions",
                        label: <span><LineChartOutlined />Transactions</span>,
                        children: (
                            /* Detailed Analysis */
        <Collapse className={styles.expandable}>
                                <Panel header="Property Transactions Analysis" key="1">
        <div className={styles.tableContainer}>
            <Table
                                            className={styles.table}
                columns={columns}
                                            dataSource={tableData}
                                            pagination={{
                                                total: 100,
                                                pageSize: 10,
                                                showSizeChanger: true,
                                                showQuickJumper: true,
                                                showTotal: (total, range) =>
                                                    `${range[0]}-${range[1]} of ${total} items`,
                                            }}
                                            scroll={{ x: 1200 }}
                                        />
                                    </div>
                                </Panel>
                            </Collapse>
                        )
                    },
                    {
                        key: "insights",
                        label: <span><PieChartOutlined />Insights</span>,
                        children: (
                            <Collapse className={styles.expandable}>
                                <Panel header="Market Trends & Insights" key="2">
                                    <Row gutter={[16, 16]}>
                                        <Col span={12}>
                                            <Card title="Market Performance by Area">
                                                <div className={styles.p16}>
                                                    <h4>Key Market Insights:</h4>
                                                    <ul>
                                                        <li>Downtown Dubai continues to lead in property values</li>
                                                        <li>Marina area shows highest transaction volume</li>
                                                        <li>Palm Jumeirah maintains premium positioning</li>
                                                        <li>Overall market shows strong recovery post-pandemic</li>
                                                    </ul>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col span={12}>
                                            <Card title="Growth Metrics">
                                                <div className={styles.p16}>
                                                    <Space direction="vertical" className={styles.w100}>
                                                        <div>
                                                            <span>Price Growth: </span>
                                                            <Progress percent={75} status="active" />
                                                        </div>
                                                        <div>
                                                            <span>Transaction Volume: </span>
                                                            <Progress percent={85} status="active" />
                                                        </div>
                                                        <div>
                                                            <span>Market Liquidity: </span>
                                                            <Progress percent={60} status="active" />
            </div>
                                                    </Space>
        </div>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Panel>
                            </Collapse>
                        )
                    }
                ]}
            />
        </div>
    );
};

export default Analytics;
