import React from 'react'
import Styles from '../styles/proj.module.css'
import { useState, useEffect } from 'react'
import api from './seats'
import JsPDF from 'jspdf'
export default function ProjX() {
    //api get seats
    var [ arr, setArr ] = useState( [] );
    const getSeats = async () => {
        const respon = await api.get( '/seats' );
        return respon.data;
    };
    useEffect( () => {
        const getAllSeats = async () => {
            const allSeats = await getSeats();
            if ( allSeats ) setArr( allSeats );
            console.log( arr )
        };
        getAllSeats()
    }, [] );
    const RELOAD = () => {
        return new Promise( () => {
            setTimeout( () => {
                window.location.reload();
            }, 500 );
        } )
    };
    const throwInvoice = () => {
        setInvoice( false );
    }
    function invoicer( i ) {
        switch ( i ) {
            case true:
                return 'none';
            case false:
                return 'block';
            default:
                return '';
        }
    }


    //api update/request seats
    const xdUpdater = async () => {
        setPlease( "Please Wait, Checking the seats" );
        var res = ( await api.post( `/resvd/`, {
            chairxds: selectedxd
        } ) ).data;
        if ( res.check == false ) {
            alert( 'SOME OR ALL SEATS YOU HAVE SELECTED HAD JUST BEEN TAKEN BY ANOTHER USER, THE PAGE WILL RELOAD NOW ' );
            RELOAD();
        };
        if ( res.check == true ) { seatsUpdater(); };
    }

    const seatsUpdater = async () => {
        await api.put( `/seats/${ selectedxd }`, {
            chairxds: selectedxd,
            color: "yellow"
        } );
        await api.post( `/resvd/${ selectedxd }`, {
            chairxds: selectedxd
        } );
        tableUpdater();
        sendMail();
        throwInvoice();
    };

    const final = () => {
        RELOAD();
    };

    const tableUpdater = async () => {
        await api.post( `/reservations/`, {
            "userName": userName,
            "email": email,
            "chairxds": selectedxd,
            "phoneNum1": phoneNumber1,
            "sid": Sid,
            "year": Year
        }
        );
    };

    const sendMail = async () => {
        await api.post( '/email/', {
            'email': email,
            'user': userName,
            'seat': selectedxd
        } )
    }

    //functions of frontend
    var [ userName, setUserName ] = useState()
    var [ Year, setYear ] = useState()
    var [ email, setEmail ] = useState()
    var [ Sid, setSid ] = useState()
    var [ numSeats, setNumSeats ] = useState( 1 )
    var [ phoneNumber1, setPhoneNumber1 ] = useState()
    var [ notification, setNotification ] = useState()
    var [ confirm, setConfirm ] = useState( true )
    var [ invoice, setInvoice ] = useState( true )
    var [ selected, setSelected ] = useState( [] );
    var [ selectedxd, setSelectedxd ] = useState( [] );
    var [ please, setPlease ] = useState( "" );
    function cellColor( color ) {
        switch ( color ) {
            case 'green':
                return 'green';
            case 'yellow':
                return 'yellow';
            case 'red':
                return 'red';
            default:
                return '';
        }
    };
    const handleChangeName = ( event ) => {
        var namevalue = event.target.value;
        setUserName( namevalue );
    };
    const handleChangeEmail = ( event ) => {
        var numvalue = event.target.value;
        setEmail( numvalue );
    };
    const handleChangeYear = ( event ) => {
        var numvalue = event.target.value;
        setYear( numvalue );
    };
    const handleChangeSid = ( event ) => {
        var numvalue = event.target.value;
        setSid( numvalue );
    };
    const handleChangePhone1 = ( event ) => {
        var phonevalue = event.target.value;
        setPhoneNumber1( phonevalue );
    };
    //first button
    function form() {
        if ( numSeats > 0 ) {
            setNotification( <p>Please Select The Seats Now And Submit <br /><br /> Scroll In All Directions To See All Chairs</p> )
            setConfirm( false )
        }
        else {
            alert( "Please choose A valid number of seats" )
        }
    }

    function taker() {
        if ( userName == null || numSeats == null || phoneNumber1 == null || Year == null || Sid == null ) {
            alert( "PLEASE FILL ALL FIELDS IN THE FORM ABOVE " );
        }
        else {
            form();
        }
    };
    // copy values into table
    function onCheck( e, xd, item ) {
        if ( userName == null || numSeats == null || phoneNumber1 == null || Year == null || Sid == null || notification == null ) {
            alert( "PLEASE FILL ALL FIELDS IN THE FORM ABOVE " );
            e.target.checked = false;
        }
        if ( e.target.checked && selectedxd.length == numSeats ) {
            alert( `You Have Already Chosen ${ selectedxd } ` )
            e.target.checked = false;
        }
        if ( e.target.checked ) {
            e.target.checked = true;
            setSelectedxd( [ ...selectedxd, xd ] );
            setSelected( [ ...selected, item ] );
        }
        else {
            e.target.checked = false;
            setSelected( selected.filter( ( currItem ) => currItem !== item ) );
            setSelectedxd( selectedxd.filter( ( currItem ) => currItem !== xd ) );
        }
    };
    const requestTicket = () => {
        if ( selectedxd.length == numSeats ) {
            xdUpdater();
        }
        else {
            alert( `please choose ${ numSeats } chair` );
            setConfirm( false );
        }
    };

    const downloadInvoiceTable = () => {
        const report = new JsPDF( 'portrait', 'pt', 'a3' );
        report.html( document.querySelector( '.proj_Displaytable__DfEO8' ) ).then( () => {
            report.save( 'invoice.pdf' );
        } );
    }
    var zoom = 1;
    function zIn() {
        if ( zoom >= 1.5 ) { zoom = 1.5 };
        if ( 0.5 < zoom < 1.5 ) {
            zoom += 0.1;
            document.querySelector( '.proj_seatsBlock__2ZJQf' ).style.transform = `scale(  ${ zoom } )`;
        }
    };
    function rst() {
        zoom = 1;
        document.querySelector( '.proj_seatsBlock__2ZJQf' ).style.transform = `scale(  ${ zoom } )`;
    };
    function zOut() {
        if ( zoom <= 0.5 ) { zoom = 0.5 }
        if ( 0.5 < zoom < 1.5 ) {
            zoom -= 0.1;
            document.querySelector( '.proj_seatsBlock__2ZJQf' ).style.transform = `scale(  ${ zoom } )`;
        }
    };


    return (
        <div className={ Styles.bgr }>
            <div className={ Styles.bgc }>
                <div className={ Styles.inputForm }>
                    <div className={ Styles.inputForm1 }>
                        <ul>
                            <li>
                                <p> برجاء التأكد من صحة رقم الهاتف والايميل لارسال رسالة التأكيد</p>
                            </li>
                            <li>
                                <p>اذا لم تتواجد بيانات صحيحة يتم الغاء الحجز تلقائيا</p></li>
                            <li>
                                <p>يتم حجز كرسي واحد فقط لكل طالب مع عدم امكانية تغييره </p>
                            </li>
                            <li>
                                <p>الغاء الحجز يتم بارسال رسالة بها بيانات الحجز او صورة لها الى <br /> reserverencebot@gmail.com</p>
                            </li>
                            <br />
                            <li>
                                <p>Please Make Sure The Phone Number And E-mail Are Correct To receive the confirmation message</p>
                            </li>
                            <li>
                                <p>take into consideration that registeration is only done ONCE and cannot be changed </p>
                            </li>
                            <li>
                                <p> to cancel the reservation please send an email to reserverencebot@gmail.com providing the reservation data or an image containing them</p>
                            </li>
                            <li>
                                <p>if the data provided isn&apos;t valid the registeration is cancelled automatically</p>
                            </li>
                        </ul>
                    </div>
                    <div className={ Styles.inputForm2 }><br />
                        <div><label>Name:</label><input type="text" onChange={ handleChangeName } required disabled={ !confirm } /></div><br />
                        <div><label>Year:</label><input type="text" onChange={ handleChangeYear } required disabled={ !confirm } /></div><br />
                        <div><label>Student ID (رقم الجلوس):</label><input type="text" onChange={ handleChangeSid } required disabled={ !confirm } /></div><br />
                        <div><label>Number of Seats:</label><input type="number" className={ Styles.Numseats } required disabled={ true } placeholder="1" /></div><br />
                        <div><label>Correct Phone Number:</label ><input type="number" onChange={ handleChangePhone1 } className={ Styles.Numseats } required disabled={ !confirm } /></div ><br />
                        <div><label>E-mail (preferably Gmail):</label ><input type="text" onChange={ handleChangeEmail } className={ Styles.Numseats } required disabled={ !confirm } /></div ><br />
                    </div>
                </div>
                <button onClick={ () => taker() } style={ { margin: "auto" } } className={ Styles.slctbtn } >Start Selecting</button>
                { notification }
                <center className={ Styles.toools }>
                    <table style={ { width: "100%", textAlign: "center" } }><tbody>
                    </tbody></table>
                    <table style={ { textAlign: "center" } }><tbody><tr>
                        <td colSpan={ 5 }><div className={ Styles.mapped1 } style={ { pointerEvents: "none", backgroundColor: "green" } }><img src='/fill.png' alt="" /></div><br />Available</td>
                        <td style={ { visibility: "hidden" } }>....</td>
                        <td colSpan={ 5 }><div className={ Styles.mapped1 } style={ { pointerEvents: "none", backgroundColor: "yellow" } }><img src='/fill.png' alt="" /></div><br />On Hold</td>
                        <td style={ { visibility: "hidden" } }>....</td>
                        <td colSpan={ 5 }><div className={ Styles.mapped1 } style={ { pointerEvents: "none", backgroundColor: "red" } }><img src='/fill.png' alt="" /></div><br />Booked</td>
                    </tr></tbody></table>
                    <a onClick={ () => zIn() }><i className="fas fa-search-plus"></i></a>
                    <a onClick={ () => zOut() }><i className="fas fa-search-minus"></i></a>
                    <a onClick={ () => rst() }><i className="fas fa-recycle"></i></a>
                </center>
                <div className={ Styles.seatStructure }>
                    <table className={ `${ Styles.seatsBlock }  ${ Styles.target }` } >
                        <tbody>
                            <tr>
                                <td colSpan="101"><div className={ Styles.screen }>STAGE</div></td>
                            </tr>
                            <tr className={ Styles.seatVGap } ></tr>
                            <tr>
                                <td>A</td>
                                <td></td>
                                <td></td>
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 0, 9 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 9, 22 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 22, 31 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            </tr>

                            <tr>
                                <td>B</td>
                                <td></td>
                                <td></td>
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 31, 41 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 41, 54 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 54, 64 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            </tr>

                            <tr>
                                <td>C</td>
                                <td></td>
                                <td></td>
                                {
                                    arr.slice( 64, 75 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 75, 88 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 88, 99 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                            </tr>
                            <tr>
                                <td>D</td>
                                <td></td>
                                <td></td>
                                {
                                    arr.slice( 99, 110 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 110, 123 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 123, 134 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                            </tr>

                            <tr>
                                <td>E</td>
                                <td></td>
                                <td></td>
                                {
                                    arr.slice( 134, 145 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 145, 158 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 158, 169 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                            </tr>

                            <tr>
                                <td>F</td>
                                <td></td>
                                <td></td>
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 169, 179 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 179, 192 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 192, 202 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            </tr>
                            <tr>
                                <td>G</td>
                                <td></td>
                                <td></td>
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 202, 212 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 212, 225 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 225, 235 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            </tr>

                            <tr>
                                <td>H</td>
                                <td></td>
                                <td></td>
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 235, 245 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 245, 258 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 258, 268 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            </tr>

                            <tr>
                                <td>I</td>
                                <td></td>
                                <td></td>
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 268, 278 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 278, 291 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 291, 301 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            </tr>

                            <tr>
                                <td>J</td>
                                <td></td>
                                <td></td>
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 301, 311 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 311, 324 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 324, 334 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            </tr>

                            <tr>
                                <td>K</td>
                                <td></td>
                                <td></td>
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 334, 344 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 344, 357 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 357, 367 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            </tr>

                            <tr>
                                <td>L</td>
                                <td></td>
                                <td></td>
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 367, 377 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 377, 390 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 390, 400 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            </tr>

                            <tr>
                                <td>M</td>
                                <td></td>
                                <td></td>
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 400, 406 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 11 }>...</td>
                                <td className={ Styles.seatGap } colSpan={ 11 }>...</td>
                                {
                                    arr.slice( 406, 413 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            </tr>

                            <tr className={ Styles.seatVGap } ><td colSpan={ 39 } ><p style={ { float: "center", fontFamily: 'Times New Roman', color: 'black' } }>
                                ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------<br />
                                ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                            </p></td></tr>

                            <tr>
                                <td>N</td>
                                <td></td>
                                <td></td>
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 413, 423 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 423, 436 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 436, 446 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            </tr>

                            <tr>
                                <td>O</td>
                                <td></td>
                                <td></td>
                                <td className={ Styles.seatGap } colSpan={ 3 }>...</td>
                                {
                                    arr.slice( 446, 454 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 454, 467 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 467, 475 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 3 }>...</td>
                            </tr>

                            <tr>
                                <td>P</td>
                                <td></td>
                                <td></td>
                                <td className={ Styles.seatGap } colSpan={ 5 }>...</td>
                                {
                                    arr.slice( 475, 481 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 481, 494 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                                {
                                    arr.slice( 494, 500 ).map( ( chair ) => {
                                        return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ { pointerEvents: `${ chair.color }` === 'green' ? 'all' : 'none', backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                    }
                                    )
                                }
                                <td className={ Styles.seatGap } colSpan={ 5 }>...</td>
                            </tr>

                            <tr className={ Styles.seatVGap } ><td colSpan={ 39 } ><p style={ { float: "center", fontFamily: 'Times New Roman', color: 'black' } }></p></td></tr>

                        </tbody>
                    </table>
                </div>
                <div className={ Styles.displayerBoxes }>
                    <button className={ `${ Styles.confirm } ${ Styles.slctbtn }` } disabled={ confirm } onClick={ () => requestTicket() }>Confirm Selection</button>
                    <p className={ Styles.please }>{ please }</p>
                    <table className={ Styles.Displaytable }>
                        <tbody>
                            <tr><td className={ Styles.hdr }><p>Name</p></td></tr>
                            <tr><td className={ Styles.dt }><p>{ userName }</p></td></tr>
                            <tr><td className={ Styles.hdr }><p>Serial Numbers of Seats</p></td></tr>
                            <tr><td className={ Styles.dt }><p>{ selectedxd.toString() }</p></td></tr>
                            <tr><td className={ Styles.hdr }><p>Phone Number</p></td></tr>
                            <tr><td className={ Styles.dt }><p>{ phoneNumber1 }</p></td></tr>
                            <tr><td className={ Styles.hdr }><p>Year</p></td></tr>
                            <tr><td className={ Styles.dt }><p>{ Year }</p></td></tr>
                            <tr><td className={ Styles.hdr }><p>Student ID</p></td></tr>
                            <tr><td className={ Styles.dt }><p>{ Sid }</p></td></tr>
                        </tbody>
                    </table>
                </div>
                <span>
                    <div className={ Styles.invoice } style={ { display: invoicer( invoice ), zIndex: 2000000 } }>
                        <p style={ { color: 'black' } }><br />
                            تم تسجيل الحجز بنجاح ✅<br /><br />
                            <b>pdfبرجاء تنزيل نسخة ال <br /> Doneقبل الضغط على زر </b><br />
                            تم تسجيل حجزك و سيتم ارسال رسالة تأكيد الى عنوان البريد الالكتروني خاصتكم
                        </p>
                        <hr />
                        <table className={ `${ Styles.Displaytable } ${ Styles.ivt }` }>
                            <tbody>
                                <tr><td className={ Styles.hdr }>Name</td></tr>
                                <tr><td className={ Styles.dt }>{ userName }</td></tr>
                                <tr><td className={ Styles.hdr }>Serial Numbers of Seats</td></tr>
                                <tr><td className={ Styles.dt }>{ selectedxd.toString() }</td></tr>
                                <tr><td className={ Styles.hdr }>Phone Number</td></tr>
                                <tr><td className={ Styles.dt }>{ phoneNumber1 }</td></tr>
                                <tr><td className={ Styles.hdr }>Year</td></tr>
                                <tr><td className={ Styles.dt }>{ Year }</td></tr>
                                <tr><td className={ Styles.hdr }>Student ID</td></tr>
                                <tr><td className={ Styles.dt }>{ Sid }</td></tr>
                            </tbody>
                        </table>
                        <button onClick={ () => downloadInvoiceTable() }>Download PDF</button>
                        <hr />
                        <p style={ { color: 'black' } }>
                            <br />
                            please download the PDF version before clicking Done <br />
                            You will recieve a confirmation message on the email provided in the form
                        </p>
                        <button onClick={ () => final() }>Done</button>
                    </div>
                </span>
            </div>
        </div> )
}
