import { useEffect, useState } from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import axios from "axios"; // Import Axios

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);

  const fetchData = async () => {
    const eventData = await axios.get("http://localhost:5000/event/getEvents");
    //console.log(eventData)
    setCurrentEvents(eventData.data.events);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDateClick = (selected) => {
    console.log(selected);
    const title = prompt("Provide Date and Event:");
    const calendarApi = selected.view.calendar;

    calendarApi.unselect();

    const isDriver = true;
    const isAdmin = true; //  to check if the user is an admin

    if (isDriver || isAdmin) {
      if (title) {
        const newEvent = {
          title,
          start: selected.startStr,
        };
        (async () =>
          await axios.post("http://localhost:5000/event/create", newEvent, {
            withCredentials: true,
          }))();

        // Send a POST request to your backend to create the event
      }
    } else {
      alert("Only admin & Driver can create events.");
    }
    window.location.reload();
  };

  const handleEventClick = (selected) => {
    const id = selected.event.extendedProps._id;
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'`
      )
    ) {
      selected.event.remove();
      const deleteData = async () => {
        await axios.delete(`http://localhost:5000/event/delete/${id}`);
      };
      deleteData();
    }
    window.location.reload();
  };

  return (
    <Box m="20px">
      <Header
        title="Waste Schedule!"
        subtitle="Full Year Waste Schedule Calender"
      />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event._Id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            events={currentEvents}
            //eventsSet={(events) => setCurrentEvents(events)}
            // initialEvents={[
            //   {
            //     id: "12315",
            //     title: "All-day event",
            //     date: "2022-09-14",
            //   }
            //   {
            //     id: "5123",
            //     title: "Timed event",
            //     date: "2022-09-28",
            //   },
            //]}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
